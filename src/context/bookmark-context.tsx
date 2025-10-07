'use client';

import React from 'react';
import type { PropsWithChildren } from 'react';
import apiService from '@/services/services';

type PostID = number;

type BookmarkState = {
  savedIds: Set<PostID>;
  inFlight: Set<PostID>;
  lastSyncedAt?: number;
};

type BookmarkActions = {
  hydrate: (opts?: { fetchAllPages?: boolean }) => Promise<void>;
  toggle: (postId: PostID) => Promise<void>;
  reconcileFromServer: (ids: PostID[]) => void;
  clear: () => void;
  isBookmarked: (postId: PostID) => boolean;
  isBusy: (postId: PostID) => boolean;
};

type BookmarkContextType = BookmarkState & BookmarkActions;

const BookmarkContext = React.createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({ children }: PropsWithChildren) {
  const [savedIds, setSavedIds] = React.useState<Set<PostID>>(new Set());
  const [inFlight, setInFlight] = React.useState<Set<PostID>>(new Set());
  const [lastSyncedAt, setLastSyncedAt] = React.useState<number | undefined>();

  const isBookmarked = React.useCallback(
    (postId: PostID) => savedIds.has(postId),
    [savedIds]
  );
  const isBusy = React.useCallback(
    (postId: PostID) => inFlight.has(postId),
    [inFlight]
  );

  const reconcileFromServer = React.useCallback((ids: PostID[]) => {
    setSavedIds(new Set(ids));
    setLastSyncedAt(Date.now());
  }, []);

  const hydrate = React.useCallback(
    async (opts?: { fetchAllPages?: boolean }) => {
      // If you don’t have a saved proxy yet, you can skip this call and start with an empty Set;
      // the Set will still stay correct as the user toggles posts.
      try {
        const fetchAll = opts?.fetchAllPages ?? false;
        const first = await apiService.getUserSavedListService(1, 20);
        let ids = first.data.posts.map((p: { id: number }) => p.id);

        if (fetchAll && first.data.pagination.totalPages > 1) {
          const total = first.data.pagination.totalPages;
          for (let page = 2; page <= total; page++) {
            const next = await apiService.getUserSavedListService(page, 20);
            ids = ids.concat(next.data.posts.map((p: { id: number }) => p.id));
          }
        }

        reconcileFromServer(ids);
      } catch (e) {
        // Non-fatal: you can still use optimistic toggles.
        console.warn('hydrate saved failed:', e);
      }
    },
    [reconcileFromServer]
  );

  const toggle = React.useCallback(
    async (postId: PostID) => {
      if (inFlight.has(postId)) return;

      const currentlySaved = savedIds.has(postId);

      // optimistic UI
      setInFlight((prev) => new Set(prev).add(postId));
      setSavedIds((prev) => {
        const copy = new Set(prev);
        if (currentlySaved) copy.delete(postId);
        else copy.add(postId);
        return copy;
      });

      try {
        // Use your proven services
        const resp = currentlySaved
          ? await apiService.deleteSavePostByIdService(postId)
          : await apiService.savePostByIdService(postId);

        // Adapter: upstream returns { data: { saved: boolean } }
        const serverSaved = !!resp?.data?.saved;

        // Reconcile with server truth
        setSavedIds((prev) => {
          const copy = new Set(prev);
          if (serverSaved) copy.add(postId);
          else copy.delete(postId);
          return copy;
        });
      } catch (err) {
        // rollback on error
        setSavedIds((prev) => {
          const copy = new Set(prev);
          if (currentlySaved) copy.add(postId);
          else copy.delete(postId);
          return copy;
        });
        console.error('bookmark toggle failed:', err);
      } finally {
        setInFlight((prev) => {
          const copy = new Set(prev);
          copy.delete(postId);
          return copy;
        });
      }
    },
    [inFlight, savedIds]
  );

  const clear = React.useCallback(() => {
    setSavedIds(new Set());
    setInFlight(new Set());
    setLastSyncedAt(undefined);
  }, []);

  const value: BookmarkContextType = {
    savedIds,
    inFlight,
    lastSyncedAt,
    hydrate,
    toggle,
    reconcileFromServer,
    clear,
    isBookmarked,
    isBusy,
  };

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = React.useContext(BookmarkContext);
  if (!ctx)
    throw new Error('useBookmarks must be used within <BookmarkProvider>');
  return ctx;
}

'use client';

import { PropsWithChildren, useEffect, useRef } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { BookmarkProvider } from '../context/bookmark-context';

const client = new QueryClient();

function HydrateAuthFromLocalStorage() {
  const qc = useQueryClient();
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    try {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      if (token && userRaw) {
        qc.setQueryData(['auth'], { token, user: JSON.parse(userRaw) });
      }
    } catch {}
  }, [qc]);

  return null;
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={client}>
      <HydrateAuthFromLocalStorage />
      <BookmarkProvider>{children}</BookmarkProvider>
    </QueryClientProvider>
  );
}

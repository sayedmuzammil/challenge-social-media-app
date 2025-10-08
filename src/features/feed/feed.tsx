'use client';

import React, { useEffect, useState } from 'react';
import { useBookmarks } from '@/context/bookmark-context';

import defaultImage from '../../../public/images/default-image.png';
import defaultAvatar from '../../../public/images/default-avatar.png';
import UserContent from '../../components/user/user-auth-content';
import apiService from '@/services/services';
import { FeedItemProps } from '../../../src/app/interfaces/images/feedItemProps';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const limit = 20;

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItemProps[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [error] = useState<string | null>(null);

  const { hydrate, lastSyncedAt } = useBookmarks();

  // load data when open the page
  useEffect(() => {
    if (!lastSyncedAt) {
      hydrate({ fetchAllPages: false });
    }

    (async () => {
      try {
        const data = await apiService.getFeedService(1, limit);
        const items: FeedItemProps[] = data?.data?.items || [];
        setFeed(data.data.items);
        setHasMore(items.length === limit);
        setPage(2);

        // console.log(
        //   'Book data fetched successfully:',
        //   data.data.items
        // );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load feed';
        console.error('Failed to load feed:', message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lastSyncedAt, hydrate]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await apiService.getFeedService(page, limit);
      const items: FeedItemProps[] = data?.data?.items || [];
      setFeed((prev) => [...prev, ...items]);
      setHasMore(items.length === limit);
      setPage(page + 1);
      setLoadingMore(false);
    } catch (error) {
      console.error('Failed to load more feed:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading)
    return (
      <div className="mx-auto flex flex-col gap-10">
        <div className="flex flex-col space-y-3">
          <Skeleton className="md:w-[300px] md:h-[300px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="md:w-[300px] md:h-[300px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <Skeleton className="md:w-[300px] md:h-[300px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col gap-10">
        {feed.map((content) => (
          <UserContent
            key={content.id}
            id={content.id}
            imageUrl={content.imageUrl || defaultImage}
            caption={content.caption || ''}
            createdAt={content.createdAt || ''}
            author={{
              id: content.author?.id,
              name: content.author?.name,
              username: content.author?.username || '',
              avatarUrl: content.author?.avatarUrl || defaultAvatar,
            }}
            likeCount={content.likeCount || 0}
            commentCount={content.commentCount || 0}
            likedByMe={content.likedByMe || false}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full max-w-xs"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feed;

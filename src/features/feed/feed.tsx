'use client';

import React, { useEffect, useState } from 'react';
import { useBookmarks } from '@/context/bookmark-context';

import defaultImage from '../../../public/images/default-image.png';
import defaultAvatar from '../../../public/images/default-avatar.png';
import UserContent from '../../components/user/user-auth-content';
import apiService from '@/services/services';
import { FeedItemProps } from '../../../src/app/interfaces/images/feedItemProps';
import { Skeleton } from '@/components/ui/skeleton';

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  const { hydrate, lastSyncedAt } = useBookmarks();

  // load data when open the page
  useEffect(() => {
    if (!lastSyncedAt) {
      hydrate({ fetchAllPages: false });
    }

    (async () => {
      try {
        const data = await apiService.getFeedService(1, 20);
        console.log('Book data fetched successfully:', data.data.items);
        setFeed(data.data.items);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to load feed';
        console.error('Failed to load feed:', message);
      } finally {
        setLoading(false);
      }
    })();
  }, [lastSyncedAt, hydrate]);

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
    </div>
  );
};

export default Feed;

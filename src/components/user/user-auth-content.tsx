'use client';

import Image, { StaticImageData } from 'next/image';
import React from 'react';
import defaultAvatar from '../../../public/images/default-avatar.png';
import defaultImage from '../../../public/images/default-image.png';
import { UserAuthContentProps } from '@/app/interfaces/user/UserAuthContentProps';
import { Bookmark, Heart, MessageSquareMore } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import DetailPageByID from '../../features/detail/detail';
import apiService from '@/services/services';
import { useBookmarks } from '../../context/bookmark-context';

const UserContent: React.FC<UserAuthContentProps> = ({
  id,
  imageUrl,
  caption,
  createdAt,
  author,
  likeCount,
  commentCount,
  likedByMe,
}) => {
  const [username, setUsername] = React.useState<string>(
    author.username ?? 'John Doe'
  );
  const [isLiked, setIsLiked] = React.useState(likedByMe ?? false);
  const [isSeeMore, setIsSeeMore] = React.useState(false);
  const [currentLikeCount, setCurrentLikeCount] = React.useState(
    likeCount ?? 0
  );
  const { isBookmarked, isBusy, toggle } = useBookmarks();

  const handleLike = async (postId: number) => {
    // ✅ Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setCurrentLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const data = wasLiked
        ? await apiService.deleteLikePostByIdService(postId)
        : await apiService.likePostByIdService(postId);
      console.log('Like action successful:', data);

      if (data?.likeCount !== undefined) {
        setCurrentLikeCount(data.likeCount);
      }
      if (data?.likedByMe !== undefined) {
        setIsLiked(data.likedByMe);
      }
    } catch (err: any) {
      console.error('Like failed:', err);
      setIsLiked(wasLiked);
      setCurrentLikeCount(likeCount ?? 0);
    }
  };

  const bookmarked = isBookmarked(id);
  const busy = isBusy(id);

  return (
    <div>
      <div className="flex flex-col gap-3" key={id}>
        <div className="flex  items-center gap-3">
          <Image
            src={author.avatarUrl ?? defaultAvatar}
            alt="Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div>
            <div className="text-md font-bold font-foreground">{username} </div>
            <div className="text-sm text-input">{createdAt}</div>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="rounded-lg focus:outline-none">
              <Image
                src={imageUrl ?? defaultImage}
                alt="Post Image"
                width={600}
                height={600}
                className="md:max-w-[600px] md:max-h-[600px] rounded-lg object-cover"
              />
            </button>
          </DialogTrigger>

          <DialogContent className="w-full md:!w-[1200px] md:!max-w-[90vw]">
            <DialogHeader>
              <DialogTitle className="hidden">Detail</DialogTitle>
            </DialogHeader>

            {/* Put the detail component directly in DialogContent, not inside DialogDescription */}
            <DetailPageByID
              id={typeof id === 'string' ? parseInt(id, 10) : id}
              imageUrl={imageUrl ?? defaultImage}
              caption={caption ?? ''}
              createdAt={createdAt ?? '-'}
              author={{
                id: author?.id ?? 0,
                username: author?.username ?? 'John Doe',
                name: author?.name ?? 'John Doe',
                // If your Author.avatarUrl type is string-only, use defaultAvatar.src
                avatarUrl:
                  (author?.avatarUrl as any) ??
                  (defaultAvatar as any).src ??
                  defaultAvatar,
              }}
              likeCount={likeCount ?? 0}
              commentCount={commentCount ?? 0}
              likedByMe={!!likedByMe}
            />
            <DialogDescription className="hidden"> {caption}</DialogDescription>

            {/* <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>

        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-4">
            <div
              className="flex flex-row gap-1 cursor-pointer"
              // onClick={() => setIsLiked(!isLiked)}
              onClick={() => handleLike(id)}
            >
              {isLiked ? <Heart fill="red" strokeWidth={0} /> : <Heart />}
              <div>{currentLikeCount}</div>
            </div>
            <div className="flex flex-row gap-1 cursor-pointer">
              <MessageSquareMore />
              <div>{commentCount}</div>
            </div>
          </div>
          <div
            onClick={() =>
              !busy && toggle(typeof id === 'string' ? parseInt(id, 10) : id)
            }
            className={`cursor-pointer ${
              busy ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {bookmarked ? (
              <Bookmark fill="white" strokeWidth={0} />
            ) : (
              <Bookmark />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-bold text-md">{author.username}</div>
          {/* <div className="text-md line-clamp-2">{caption}</div> */}
          <div
            className={`text-md 
            ${isSeeMore === false ? 'line-clamp-2' : 'line-clamp-none'}
            `}
          >
            {caption}
          </div>
          <div
            className="text-primary text-md font-semibold"
            onClick={() => setIsSeeMore(!isSeeMore)}
          >
            {isSeeMore ? '' : 'See More'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContent;

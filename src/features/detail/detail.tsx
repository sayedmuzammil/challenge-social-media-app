'use client';

import { Author } from '@/app/interfaces/user/author';
import { CommentProps } from '@/app/interfaces/user/commentProps';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CommentList from '@/components/user/user-comment-list';
import { useBookmarks } from '@/context/bookmark-context';
import apiService from '@/services/services';
import { Bookmark, Heart, MessageSquareMore, Smile } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PostCommentComponent from '../post-comment/post-comment';
import { Emojis } from '../emoji/emoji';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailPageByIDProps {
  id: number;
  imageUrl: string | StaticImageData;
  caption: string;
  createdAt: string;
  author: Author;
  commentList?: CommentProps[] | [];
  likeCount?: number | 0;
  commentCount?: number | 0;
  likedByMe: boolean;
}

const DetailPageByID: React.FC<DetailPageByIDProps> = ({
  id,
  imageUrl,
  caption,
  createdAt,
  author,
  commentList = [],
  likeCount = 0,
  commentCount = 0,
  likedByMe,
}) => {
  const [isLiked, setIsLiked] = React.useState(likedByMe);
  const [currentLikeCount, setCurrentLikeCount] = React.useState(likeCount);
  const [comment, setComment] = React.useState('');
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const caretRef = React.useRef<number | null>(null);
  const [openComment, setOpenComment] = React.useState(false);
  const [commentsList, setCommentsList] = React.useState<CommentProps[]>([]);
  const [loadingComments, setLoadingComments] = React.useState(false);

  const { isBookmarked, isBusy, toggle } = useBookmarks();

  const bookmarked = isBookmarked(id);
  const busy = isBusy(id);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setCurrentLikeCount(isLiked ? currentLikeCount - 1 : currentLikeCount + 1);
  };

  // remember caret so we can insert at cursor
  const rememberCaret = () => {
    const el = inputRef.current;
    if (!el) return;
    caretRef.current = el.selectionStart ?? el.value.length;
  };

  const insertAtCaret = (text: string) => {
    const el = inputRef.current;
    if (!el) {
      setComment((v) => v + text);
      return;
    }
    const caret = caretRef.current ?? el.value.length;
    const before = comment.slice(0, caret);
    const after = comment.slice(caret);
    const next = `${before}${text}${after}`;
    setComment(next);
    // restore focus + caret right after emoji
    requestAnimationFrame(() => {
      el.focus();
      const pos = caret + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handlePost = async () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      const postId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await apiService.postCommentService(
        postId.toString(),
        trimmed
      );
      console.log('Comment posted:', response);
      setComment('');
    } catch (err: any) {
      console.error('Failed to post comment:', err?.message || err);
    }
  };

  interface CommentProps {
    id: number;
    text: string;
    createdAt: string;
    author: Author;
  }

  const handleCommentClick = () => {
    setOpenComment(!openComment);
    console.log('openComment:', openComment);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await apiService.getCommentListByID(id, 1, 10);
        console.log('Raw comments response:', response);
        const items = response?.data?.comments;
        console.log('Comments fetched:', items);
        setCommentsList(items);
      } catch (err: any) {
        console.error('Failed to fetch comments:', err?.message || err);
      } finally {
        setLoadingComments(false);
      }
    })();
  }, []);

  return (
    <div className="h-full w-full md:max-w-[1200px] mx-auto ">
      <div className="h-full grid grid-cols-1 md:grid-cols-2 ">
        <div className="flex flex-col gap-3">
          {/* Image Section */}
          <div className="w-full h-auto ">
            <Image
              src={imageUrl}
              alt="Post image"
              width={720}
              height={720}
              className="object-cover rounded-lg "
            />
          </div>
          <div className="display md:hidden">
            {/* Author Info */}
            <div className="flex flex-row gap-3 mb-6">
              <div className="flex items-center">
                <Image
                  src={author.avatarUrl || '/images/default-avatar.png'}
                  alt={`${author.username}'s avatar`}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover "
                />
              </div>
              <div className="flex flex-col">
                <div className="text-md font-bold">{author.username}</div>
                <div className="text-sm text-gray-500">{createdAt}</div>
              </div>
            </div>

            {/* Caption */}
            <div className="text-md mb-6">{caption}</div>

            {/* <div className="border-t border-gray-200 mb-4" /> */}
          </div>
        </div>

        {/* Content Section */}
        <div className="h-full w-full flex flex-col justify-between md:p-5  ">
          <div className="flex flex-col justify-between">
            {/* Author Info */}
            {/* <div className="flex flex-row gap-3 mb-6">
              <div className="flex items-center">
                <Image
                  src={author.avatarUrl || '/images/default-avatar.png'}
                  alt={`${author.username}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover "
                />
              </div>
              <div className="flex flex-col">
                <div className="text-md font-bold">{author.username}</div>
                <div className="text-sm text-gray-500">{createdAt}</div>
              </div>
            </div> */}

            {/* Caption */}
            {/* <div className="text-md mb-6">{caption}</div>

            <div className="border-t border-gray-200 mb-4" /> */}

            {/* Comments Section */}
            {/* <div className="flex-1 overflow-y-auto mb-4">
              <div className="text-sm font-semibold mb-3">Comments</div>
              {commentList.length > 0 ? (
                <div className="space-y-4">
                  {commentList.map((comment) => (
                    <div key={comment.id}>
                      <CommentList {...comment} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No comments yet</div>
              )}
            </div>

            <div className="border-t border-gray-200 mb-4" /> */}
          </div>

          <div>
            {/* Action Buttons */}
            <div className="flex flex-row justify-between items-center mb-4">
              <div className="flex flex-row gap-4">
                <button
                  className="flex flex-row gap-1 items-center cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={handleLikeClick}
                >
                  {isLiked ? <Heart fill="red" stroke="red" /> : <Heart />}
                  <span className="text-sm">{currentLikeCount}</span>
                </button>
                <div className="flex flex-row gap-1 items-center">
                  <Drawer
                    onOpenChange={(open) => {
                      if (open) setTimeout(() => inputRef.current?.focus(), 60);
                    }}
                  >
                    <DrawerTrigger asChild>
                      <button
                        type="button"
                        aria-label="Open comments"
                        className="inline-flex"
                      >
                        <MessageSquareMore />
                      </button>
                    </DrawerTrigger>

                    <DrawerContent className="py-6">
                      <div className="flex h-[85vh] flex-col">
                        {/* Header */}
                        <DrawerHeader className="px-4">
                          <DrawerTitle>Comments</DrawerTitle>
                        </DrawerHeader>

                        {/* Scrollable list */}
                        <div className="flex-1 overflow-y-auto px-4 pb-24">
                          {loadingComments ? (
                            <div className="text-sm text-muted-foreground py-6">
                              Loading…
                            </div>
                          ) : commentsList.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-6">
                              No comments yet
                            </div>
                          ) : (
                            <div className="divide-y divide-border rounded-xl pb-4 bg-card/50">
                              <ScrollArea>
                                {commentsList.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="flex justify-center items-center gap-3 p-4 border-t border-border"
                                  >
                                    <Image
                                      src={
                                        comment.author.avatarUrl ||
                                        '/images/default-avatar.png'
                                      }
                                      alt={comment.author.username}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold">
                                          {comment.author.name ||
                                            comment.author.username}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-sm">
                                        {comment.text}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </ScrollArea>
                            </div>
                          )}
                        </div>

                        {/* Footer stays visible */}
                        <div className="sticky bottom-0 left-0 w-full bg-background border-t border-border p-3">
                          <PostCommentComponent
                            comment={comment}
                            setComment={setComment}
                            onPost={handlePost}
                            emojiOpen={emojiOpen}
                            setEmojiOpen={setEmojiOpen}
                            inputRef={inputRef}
                            rememberCaret={rememberCaret}
                            insertAtCaret={insertAtCaret}
                            EMOJIS={Emojis}
                            btnSizeClass="w-10 h-10"
                            inputHeightClass="h-10"
                          />
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>

                  <span className="text-sm">{commentCount}</span>
                </div>
              </div>
              <div
                onClick={() =>
                  !busy &&
                  toggle(typeof id === 'string' ? parseInt(id, 10) : id)
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

            {/* Comment Input */}
            <PostCommentComponent
              comment={comment}
              setComment={setComment}
              onPost={handlePost}
              emojiOpen={emojiOpen}
              setEmojiOpen={setEmojiOpen}
              inputRef={inputRef}
              rememberCaret={rememberCaret}
              insertAtCaret={insertAtCaret}
              EMOJIS={Emojis}
              btnSizeClass="w-12 h-12"
              inputHeightClass="h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageByID;

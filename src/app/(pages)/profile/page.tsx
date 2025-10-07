'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import defaultAvatar from '../../../../public/images/default-avatar.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import defaultImage from '../../../../public/images/default-image.png';
import apiService from '@/services/services';
import { FeedItemProps } from '@/app/interfaces/images/feedItemProps';
import Navbar from '@/components/navbar/navbar';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DetailPageByID from '@/features/detail/detail';

const Profile = () => {
  const auth = useAuth();
  const name = auth?.user.name || 'johndoe';
  const username = auth?.user.username || 'John Doe';
  const avatar = auth?.user.avatarUrl || defaultAvatar;

  const [stats, setStats] = React.useState({
    posts: 0,
    followers: 0,
    following: 0,
    likes: 0,
  });

  const [postList, setPostList] = React.useState<FeedItemProps[]>([]);
  const [savedList, setSavedList] = React.useState<FeedItemProps[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const dataStats = await apiService.getUserStats();
        setStats(dataStats.data.stats ?? []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getUserSavedListService error:', msg);
      }
    })();
  }, [auth?.user?.username]);

  useEffect(() => {
    const uname = auth?.user?.username;
    if (!uname) return; // wait until auth is ready

    (async () => {
      try {
        const dataPost = await apiService.getUserPostsListService(uname, 1, 20);
        const dataSaved = await apiService.getUserSavedListService(1, 20);

        setPostList(dataPost?.data?.posts ?? []);
        setSavedList(dataSaved?.data?.posts ?? []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getUserPostsListService error:', msg);
      }
    })();
  }, [auth?.user?.username]);

  useEffect(() => {
    (async () => {
      try {
        const dataSaved = await apiService.getUserSavedListService(1, 20);
        setSavedList(dataSaved?.data?.posts ?? []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('getUserSavedListService error:', msg);
      }
    })();
  }, [auth?.user?.username]);

  return (
    <div>
      <Navbar />
      <div className="w-full p-6 md:w-203 mx-auto md:mt-10">
        <div className="w-full flex flex-col gap-4 mb-4">
          {/* Account */}
          <div className="flex flex-row items-center justify-between">
            <div className="flex  items-center gap-3">
              <Image
                src={avatar}
                alt="Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <div className="text-md font-bold font-foreground">{name} </div>
                <div className="text-sm text-input">{username}</div>
              </div>
            </div>
            <Button>
              {' '}
              <Link href="/edit"> Edit Profile </Link>{' '}
            </Button>
          </div>
          <div className="text-foreground text-sm md:text-md">
            Creating unforgettable moments with my favorite person! 📸✨
            Let&apos;s
          </div>

          {/* Stats */}
          <div className="w-full grid grid-cols-4 gap-1">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-foreground text-lg md:text-xl font-bold">
                {stats.posts}
              </div>
              <div className="text-foreground/80 text-xs md:text-md">Posts</div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-foreground text-lg md:text-xl font-bold">
                {stats.followers}
              </div>
              <div className="text-foreground/80 text-xs md:text-md">
                Followers
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-foreground text-lg md:text-xl font-bold">
                {stats.following}
              </div>
              <div className="text-foreground/80 text-xs md:text-md">
                Following
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-foreground text-lg md:text-xl font-bold">
                {stats.likes}
              </div>
              <div className="text-foreground/80 text-xs md:text-md">Likes</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="w-full h-12 flex flex-row gap-4 justify-center items-center">
              <TabsTrigger value="gallery">
                <div className="flex flex-row items-center justify-center gap-3">
                  <LayoutGrid className="max-w-6 max-h-6 rounded-full" />
                  <div className="text-sm md:text-md">Gallery</div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="saved">
                <div className="flex flex-row items-center justify-center gap-3">
                  <Bookmark className="max-w-6 max-h-6 rounded-full" />
                  <div className="text-sm md:text-md">Saved</div>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Gallery Tabs */}
            <TabsContent value="gallery">
              <div className="w-full grid grid-cols-3 gap-1 ">
                {postList.map((post: FeedItemProps) => (
                  <div key={post.id} className="rounded-2xl focus:outline-none">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Image
                          src={post.imageUrl || defaultImage}
                          alt="image"
                          width={268}
                          height={268}
                          className="max-w-30 max-h-30 md:max-w-63 md:max-h-63 object-cover rounded-2xl"
                        />
                      </DialogTrigger>

                      <DialogContent
                        showCloseButton={false}
                        className="max-w-none w-full h-full  md:!w-[1200px] md:!max-w-[90vw] md:max-h-[768px] flex flex-col gap-4"
                      >
                        <DialogHeader className="h-5 flex flex-row justify-start items-center ">
                          <DialogClose asChild>
                            <DialogTitle
                              className="cursor-pointer transition flex flex-row justify-start items-start gap-2"
                              title="Click to close"
                            >
                              <ArrowLeft />
                              <div>Back</div>
                            </DialogTitle>
                          </DialogClose>
                        </DialogHeader>
                        <div className="w-full h-full">
                          <DetailPageByID
                            id={post.id}
                            imageUrl={post.imageUrl ?? defaultImage}
                            caption={post.caption ?? ''}
                            createdAt={post.createdAt ?? '-'}
                            author={{
                              id: post.author?.id ?? 0,
                              username: post.author?.username ?? 'John Doe',
                              name: post.author?.name ?? 'John Doe',
                              avatarUrl:
                                post.author?.avatarUrl ?? defaultAvatar,
                            }}
                            likeCount={post.likeCount ?? 0}
                            commentCount={post.commentCount ?? 0}
                            likedByMe={!!post.likedByMe}
                          />
                        </div>

                        <DialogDescription className="hidden">
                          {post.caption}
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Saved Tabs */}
            <TabsContent value="saved">
              <div className="w-full grid grid-cols-3 gap-2 ">
                {savedList.map((post: FeedItemProps) => (
                  <div key={post.id} className="rounded-2xl focus:outline-none">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Image
                          src={post.imageUrl || defaultImage}
                          alt="image"
                          width={268}
                          height={268}
                          className="max-w-30 max-h-30 md:max-w-63 md:max-h-63 object-cover rounded-2xl"
                        />
                      </DialogTrigger>

                      <DialogContent
                        showCloseButton={false}
                        className="max-w-none w-full h-full  md:!w-[1200px] md:!max-w-[90vw] md:max-h-[768px] flex flex-col gap-4"
                      >
                        <DialogHeader className="h-5 flex flex-row justify-start items-center ">
                          <DialogClose asChild>
                            <DialogTitle
                              className="cursor-pointer transition flex flex-row justify-start items-start gap-2"
                              title="Click to close"
                            >
                              <ArrowLeft />
                              <div>Back</div>
                            </DialogTitle>
                          </DialogClose>
                        </DialogHeader>
                        <div className="w-full  h-full ">
                          <DetailPageByID
                            id={post.id}
                            imageUrl={post.imageUrl ?? defaultImage}
                            caption={post.caption ?? ''}
                            createdAt={post.createdAt ?? '-'}
                            author={{
                              id: post.author?.id ?? 0,
                              username: post.author?.username ?? 'John Doe',
                              name: post.author?.name ?? 'John Doe',
                              avatarUrl:
                                post.author?.avatarUrl ?? defaultAvatar,
                            }}
                            likeCount={post.likeCount ?? 0}
                            commentCount={post.commentCount ?? 0}
                            likedByMe={!!post.likedByMe}
                          />
                        </div>

                        <DialogDescription className="hidden">
                          {post.caption}
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;

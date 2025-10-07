// src/app/(pages)/detail/[id]/page.tsx
import { notFound } from 'next/navigation';
import DetailPageByID from '../../../../features/detail/detail';
import defaultImage from '../../../../../public/images/default-image.png';
import defaultAvatar from '../../../../../public/images/default-avatar.png';

async function getPost(id: string) {
  const DATA = [
    {
      id: '1',
      authorId: '10',
      author: 'John Doe',
      createdAt: 'Jan 1, 2023',
      imageUrl: '',
      caption: 'A beautiful sunrise',
      authorImage: null,
    },
    {
      id: '2',
      authorId: '20',
      author: 'John Doe',
      createdAt: 'Jan 1, 2023',
      imageUrl: '',
      caption: 'Hello world!',
      authorImage: null,
    },
  ];
  return DATA.find((p) => p.id === id) ?? null;
}

async function getComments(postId: string) {
  return [
    {
      id: 1,
      text: 'Nice post!',
      createdAt: '2025-09-30T15:01:56.375Z',
      author: {
        id: 23,
        username: 'string',
        name: 'string',
        avatarUrl: { defaultAvatar }, // served from public
      },
    },
  ];
}

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) return notFound();

  const comments = await getComments(params.id);

  return (
    <DetailPageByID
      id={parseInt(post.id, 10)}
      imageUrl={post.imageUrl || defaultImage}
      caption={post.caption}
      createdAt={post.createdAt}
      author={{
        id: post.authorId,
        username: post.author,
        name: post.author,
        avatarUrl: post.authorImage || defaultAvatar,
      }}
      // commentList={comments}
      likeCount={0}
      commentCount={comments.length}
      likedByMe={false}
    />
  );
}

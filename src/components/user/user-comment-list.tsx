'use client';

import React from 'react';
import { CommentProps } from '@/app/interfaces/user/commentProps';
import Image from 'next/image';

const CommentList: React.FC<CommentProps> = ({
  id,
  text,
  createdAt,
  author,
}) => {
  return (
    <div className="flex flex-col gap-3  " key={id}>
      <div className="flex  items-center gap-3">
        <Image
          src={author.avatarUrl || '/images/default-avatar.png'}
          alt="Logo"
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <div className="text-md font-bold text-foreground">
            {author.username}
          </div>
          <div className="text-sm text-input">{createdAt}</div>
        </div>
      </div>
      <div className="text-sm text-foreground">{text}</div>
    </div>
  );
};

export default CommentList;

import { StaticImageData } from 'next/image';
import { Author } from '../../interfaces/user/author';

export interface UserAuthContentProps {
  id: number;
  imageUrl: string | StaticImageData;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount?: number | 0;
  commentCount?: number | 0;
  likedByMe: boolean;
}

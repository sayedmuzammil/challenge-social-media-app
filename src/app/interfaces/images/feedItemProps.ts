import { Author } from '../user/author';

export interface FeedItemProps {
  id: number;
  userImage?: string | null;
  author?: Author;
  createdAt?: string;
  imageUrl?: string;
  caption?: string;
  likeCount?: number;
  commentCount?: number;
  likedByMe?: boolean;
}

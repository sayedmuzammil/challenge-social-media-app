import { Author } from './author';

export interface CommentProps {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
}

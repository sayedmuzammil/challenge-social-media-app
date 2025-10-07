import { StaticImageData } from 'next/image';

export interface Author {
  id?: number | string;
  username: string;
  name?: string;
  avatarUrl?: string | StaticImageData;
}

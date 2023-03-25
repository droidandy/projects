import { BlogNode } from '@marketplace/ui-kit/types';

export type BlogPostHashtagDTO = BlogNode & {};

export type BlogHashtagDTO = BlogPostHashtagDTO & {
  keywords: string;
  title: string;
  h1: string;
  description: string;
  created_at: number;
  updated_at: number;
  creator_id: number;
  editor_id: number;
};

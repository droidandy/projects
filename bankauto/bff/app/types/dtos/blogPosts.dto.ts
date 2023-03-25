import { BlogNode, BlogPostAuthor } from '@marketplace/ui-kit/types';
import { BlogPostHashtagDTO } from './blogHashtag.dto';

export type BlogImagesDTO = {
  '1920'?: string;
  '1580'?: string;
  '1040'?: string;
  '500'?: string;
  '335'?: string;
};

export type BlogPostListItemDTO = {
  id: number;
  name: string;
  alias: string;
  published_at: null | number;
  updated_at: number;
  author: null | BlogPostAuthor;
  category: BlogCategoryDTO;
  images: [] | BlogImagesDTO;
};

export type BlogPostDTO = BlogPostListItemDTO & {
  hide_at: null | number;
  created_at: number;
  creator_id: null | number;
  editor_id: null | number;
  is_active: null | 1;
  is_main: null | 1;
  is_promo: null | 1;
  is_comment: null | 1;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_type: string;
  og_image: string;
  alias: string;
  main_image: string;
  images: never[] | BlogImagesDTO;
  hashtags: BlogPostHashtagDTO[];
  average_rating: number;
  votes_number: number;
  is_voted?: boolean;
};

export type RatingDTO = {
  average_rating: number;
  votes_number: number;
};

export type BlogCategoryDTO = BlogNode & {
  parent_id: null | number;
};
export type BlogPostsItemsDTO = {
  items: BlogPostListItemDTO[];
};

export type BlogPostsCountDTO = {
  count: number;
};

export type BlogPostsDTO = BlogPostsItemsDTO & BlogPostsCountDTO;

export type BlogPostDetailedDTO = BlogPostDTO & {
  description: string;
  text_json: string;
  text_html: string;
};

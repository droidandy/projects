import { BlogPostDetailedDTO, BlogPostListItemDTO } from '../../../../types/dtos/blogPosts.dto';

export const BlogPostDTOMock: BlogPostListItemDTO = {
  id: 104,
  name: 'Это тестовая статья для проверки нового API',
  alias: 'eto-testovaa-stata-dla-proverki-novogo-api',
  published_at: null,
  updated_at: 1608732274,
  author: {
    id: 61,
    name: 'Виталий',
    surname: 'Королев',
    patronymic: 'Олегович',
  },
  category: {
    id: 1,
    alias: 'news',
    name: 'Новости',
    parent_id: null,
  },
  images: {
    '1920': 'string',
    '1580': 'string',
    '1040': 'string',
    '500': 'string',
    '335': 'string',
  },
};

export const BlogPostDetailedDTOMock: BlogPostDetailedDTO = {
  ...BlogPostDTOMock,
  hide_at: null,
  created_at: 1608732274,
  creator_id: 1,
  editor_id: null,
  is_active: 1,
  is_main: 1,
  is_promo: 1,
  is_comment: 1,
  meta_title: 'meta meta_title',
  meta_description: 'meta meta_description',
  meta_keywords: 'meta meta_keywords',
  og_title: 'meta og_title',
  og_description: 'meta og_description',
  og_type: 'meta og_type',
  og_image: 'meta og_image',
  average_rating: 0,
  votes_number: 0,
  is_voted: false,
  main_image: 'http://cdn.marketplace.dev.bankauto.lo/catalog/blog_post/104/5f847b02-d590-4b35-91af-06e287e067ee.jpeg',
  hashtags: [
    {
      id: 1,
      alias: 'technology',
      name: 'Технлогии',
    },
  ],
  description: 'description',
  text_json: 'text_json',
  text_html: 'text_html',
};

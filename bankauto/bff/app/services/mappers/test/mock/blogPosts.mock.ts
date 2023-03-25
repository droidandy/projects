import { BlogPostDetailed, BlogPostNode } from '@marketplace/ui-kit/types';
import { BlogCategoryMock } from './blogCategories.mock';

export const BlogPostMock: BlogPostNode = {
  id: 104,
  name: 'Это тестовая статья для проверки нового API',
  alias: 'eto-testovaa-stata-dla-proverki-novogo-api',
  publishedAt: null,
  updatedAt: 1608732274,
  author: {
    id: 61,
    name: 'Виталий',
    surname: 'Королев',
    patronymic: 'Олегович',
  },
  category: BlogCategoryMock,
  images: {
    '1920': 'string',
    '1580': 'string',
    '1040': 'string',
    '500': 'string',
    '335': 'string',
  },
};

export const BlogPostDetailedMock: BlogPostDetailed = {
  ...BlogPostMock,
  hideAt: null,
  createdAt: 1608732274,
  mainImage: 'http://cdn.marketplace.dev.bankauto.lo/catalog/blog_post/104/5f847b02-d590-4b35-91af-06e287e067ee.jpeg',
  statuses: {
    isActive: true,
    isMain: true,
    isPromo: true,
    isComment: true,
  },
  meta: {
    metaTitle: 'meta meta_title',
    metaDescription: 'meta meta_description',
    metaKeywords: 'meta meta_keywords',
    ogTitle: 'meta og_title',
    ogDescription: 'meta og_description',
    ogType: 'meta og_type',
    ogImage: 'meta og_image',
  },
  rating: {
    averageRating: 0,
    votesNumber: 0,
    isVoted: false,
  },
  hashtags: [
    {
      id: 1,
      alias: 'technology',
      name: 'Технлогии',
    },
  ],
  description: 'description',
  text: {
    json: 'text_json',
    html: 'text_html',
  },
};

import {
  BlogPostAuthor,
  BlogPostMeta,
  BlogPostImages,
  BlogCategory,
  BlogPostStatuses,
  BlogPostNode,
  BlogPostDetailed,
  BlogPostDetailedText,
  BlogPosts,
  BlogPostRating,
} from '@marketplace/ui-kit/types';
import {
  RatingDTO,
  BlogPostDetailedDTO,
  BlogPostDTO,
  BlogPostsCountDTO,
  BlogPostsItemsDTO,
  BlogPostListItemDTO,
} from '../../types/dtos/blogPosts.dto';

import { pipeMapper } from './utils';
import { BaseBlogNodeHashtagsMapper } from './blogHashtag.mapper';

export const BlogPostCategoryMapper = <T>(item: T, dto: BlogPostListItemDTO): T & BlogCategory => {
  return {
    ...item,
    id: dto.category?.id,
    name: dto.category?.name,
    alias: dto.category?.alias,
    parentId: dto.category?.parent_id,
  };
};

export const BlogPostImagesMapper = <T>(item: T, dto: BlogPostListItemDTO): T & BlogPostImages => {
  return {
    ...item,
    '1920': dto.images['1920'],
    '1580': dto.images['1580'],
    '1040': dto.images['1040'],
    '500': dto.images['500'],
    '335': dto.images['335'],
  };
};

const BlogPostAuthorMapper = <T>(item: T, dto: BlogPostListItemDTO): (T & BlogPostAuthor) | null => {
  return !dto.author
    ? null
    : {
        ...item,
        id: dto.author.id,
        name: dto.author.name,
        surname: dto.author.surname,
        patronymic: dto.author.patronymic,
      };
};

const BlogPostStatusesMapper = <T>(item: T, dto: BlogPostDTO): T & BlogPostStatuses => {
  return {
    ...item,
    isActive: !!dto.is_active,
    isMain: !!dto.is_main,
    isPromo: !!dto.is_promo,
    isComment: !!dto.is_comment,
  };
};

const BlogPostMetaMapper = <T>(item: T, dto: BlogPostDTO): T & BlogPostMeta => {
  return {
    ...item,
    metaTitle: dto.meta_title ?? dto.name,
    metaDescription: dto.meta_description ?? dto.name,
    metaKeywords: dto.meta_keywords ?? dto.name,
    ogTitle: dto.og_title ?? dto.name,
    ogDescription: dto.og_description ?? dto.name,
    ogType: dto.og_type ?? dto.name,
    ogImage: dto.og_image ?? dto.main_image,
  };
};

export const BlogPostRatingMapper = <T>(item: T, dto: BlogPostDTO): T & BlogPostRating => {
  return {
    ...item,
    averageRating: dto.average_rating,
    votesNumber: dto.votes_number,
    isVoted: dto.is_voted ?? false,
  };
};

export const PostRatingMapper = (rating: RatingDTO): BlogPostRating => {
  return {
    averageRating: rating.average_rating,
    votesNumber: rating.votes_number,
  };
};

export const BlogPostBaseMapper = <T>(item: T, dto: BlogPostListItemDTO): T & BlogPostNode => {
  return {
    ...item,
    id: dto.id,
    name: dto.name,
    alias: dto.alias,
    publishedAt: dto.published_at,
    updatedAt: dto.updated_at,
    author: BlogPostAuthorMapper({}, dto),
    category: BlogPostCategoryMapper({}, dto),
    images: BlogPostImagesMapper({}, dto),
  };
};

export const BlogPostMapper = pipeMapper(
  BlogPostBaseMapper,
  <T extends BlogPostNode>(item: T, dto: BlogPostListItemDTO): T & BlogPostNode => {
    return {
      ...item,
      author: BlogPostAuthorMapper({}, dto),
    };
  },
);

export const BlogPostsMapper = (dto: BlogPostsItemsDTO & BlogPostsCountDTO): BlogPosts => {
  return {
    items: dto.items.map((post) => BlogPostMapper({}, post)),
    count: dto.count,
  };
};

export const BlogPostTextMapper = <T>(item: T, dto: BlogPostDetailedDTO): T & BlogPostDetailedText => {
  return {
    ...item,
    html: dto.text_html,
    json: dto.text_json,
  };
};

export const BlogPostDetailedMapper = pipeMapper(
  BlogPostBaseMapper,
  <T extends BlogPostNode>(item: T, dto: BlogPostDetailedDTO): T & BlogPostDetailed => {
    return {
      ...item,
      hideAt: dto.hide_at,
      createdAt: dto.created_at,
      mainImage: dto.main_image,
      hashtags: BaseBlogNodeHashtagsMapper(dto.hashtags),
      rating: BlogPostRatingMapper({}, dto),
      description: dto.description,
      statuses: BlogPostStatusesMapper({}, dto),
      meta: BlogPostMetaMapper({}, dto),
      text: BlogPostTextMapper({}, dto),
    };
  },
);

import { BlogHashtag, BaseBlogHashtag } from '@marketplace/ui-kit/types/Blog';

import { BlogHashtagDTO, BlogPostHashtagDTO } from '../../types/dtos/blogHashtag.dto';
import { pipeMapper } from './utils';

const BaseBlogNodeHashtagMapper = <T>(item: T, dto: BlogPostHashtagDTO): T & BaseBlogHashtag => {
  return {
    ...item,
    id: dto.id,
    name: dto.name,
    alias: dto.alias,
  };
};

const BaseBlogHashtagMapper = <T>(item: T, dto: BlogHashtagDTO): T & BlogHashtag => {
  return {
    ...item,

    id: dto.id,
    name: dto.name,
    alias: dto.alias,
    keywords: dto.keywords,
    title: dto.title,
    h1: dto.h1,
    description: dto.description,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    creatorId: dto.creator_id,
    editorId: dto.editor_id,
  };
};

export const BlogHashtagMapper = pipeMapper(BaseBlogHashtagMapper);

export const BlogHashtagsMapper = (dto: BlogHashtagDTO[]): BlogHashtag[] => {
  return dto.map((hashtag) => BlogHashtagMapper({}, hashtag));
};

export const BaseBlogNodeHashtagsMapper = (dto: BlogPostHashtagDTO[]): BaseBlogHashtag[] => {
  return dto.map((hashtag) => BaseBlogNodeHashtagMapper({}, hashtag));
};

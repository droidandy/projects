import { BlogCategories, BlogCategory } from '@marketplace/ui-kit/types/Blog';
import { BlogCategoriesDTO, BlogCategoryDTO } from '../../types/dtos/blogCategories.dto';
import { pipeMapper } from './utils';

export const BlogCategoryBaseMapper = <T>(item: T, dto: BlogCategoryDTO): T & BlogCategory => {
  return {
    ...item,
    id: dto.id,
    alias: dto.alias,
    name: dto.name,
    parentId: dto.parent_id,
  };
};

export const BlogCategoryMapper = pipeMapper(BlogCategoryBaseMapper);

export const BlogCategoriesMapper = (dto: BlogCategoriesDTO): BlogCategories => {
  return dto.map((category) => BlogCategoryMapper({}, category));
};

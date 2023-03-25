import { BlogCategoryMapper } from '../blogCategories.mapper';
import { BlogCategoryDTOMock } from './mock/blogCategoriesDto.mock';
import { BlogCategoryMock } from './mock/blogCategories.mock';

describe('Blog', () => {
  it('BlogCategory mapping', () => {
    const r = BlogCategoryMapper({}, BlogCategoryDTOMock);
    expect(r).toEqual(BlogCategoryMock);
  });
});

import { BlogPostMapper, BlogPostDetailedMapper } from '../blogPosts.mapper';
import { BlogPostDTOMock, BlogPostDetailedDTOMock } from './mock/blogPostsDto.mock';
import { BlogPostMock, BlogPostDetailedMock } from './mock/blogPosts.mock';

describe('Blog', () => {
  it('BlogPostMapper mapping', () => {
    const r = BlogPostMapper({}, BlogPostDTOMock);
    expect(r).toEqual(BlogPostMock);
  });

  it('BlogPostDetailedMapper mapping', () => {
    const r = BlogPostDetailedMapper({}, BlogPostDetailedDTOMock);
    expect(r).toEqual(BlogPostDetailedMock);
  });
});

import { BlogHashtagMapper } from '../blogHashtag.mapper';
import { BlogHashtagDTOMock } from './mock/blogHashtagDto.mock';
import { BlogHashtagMock } from './mock/blogHashtag.mock';

describe('Blog', () => {
  it('BlogHashtag mapping', () => {
    const r = BlogHashtagMapper({}, BlogHashtagDTOMock);
    expect(r).toEqual(BlogHashtagMock);
  });
});

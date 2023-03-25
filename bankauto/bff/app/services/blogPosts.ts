import { AxiosResponse } from 'axios';
import { BlogPostDetailed, BlogPosts, BlogPostRating } from '@marketplace/ui-kit/types';
import { RatingDTO, BlogPostDetailedDTO, BlogPostsDTO } from '../types/dtos/blogPosts.dto';
import API, { DIR_URL } from '../config';

import { BlogPostDetailedMapper, BlogPostsMapper, PostRatingMapper } from './mappers/blogPosts.mapper';

export const getPosts = (params: Record<string, any>): Promise<AxiosResponse<BlogPosts>> => {
  return API.get<BlogPostsDTO>(
    '/v1/blog/posts',
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return {
      ...response,
      data: BlogPostsMapper({
        ...response.data,
        items: response.data.items,
      }),
    };
  });
};

export const getDetailedPost = (
  slug: string,
  params: Record<string, any>,
): Promise<AxiosResponse<BlogPostDetailed>> => {
  return API.get<BlogPostDetailedDTO>(
    `/v1/blog/posts/alias/${slug}`,
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return {
      ...response,
      data: BlogPostDetailedMapper(
        {},
        {
          ...response.data,
        },
      ),
    };
  });
};

export const setPostRating = (
  alias: string,
  rating: string,
  clientId: string,
): Promise<AxiosResponse<BlogPostRating>> => {
  return API.post<RatingDTO>(
    `/v1/blog/posts/alias/${alias}/ratings`,
    { rating, clientId },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return {
      ...response,
      data: PostRatingMapper(response.data),
    };
  });
};

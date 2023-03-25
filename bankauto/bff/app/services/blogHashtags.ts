import { AxiosResponse } from 'axios';
import { BlogHashtag } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { BlogHashtagDTO } from '../types/dtos/blogHashtag.dto';
import { BlogHashtagMapper, BlogHashtagsMapper } from './mappers/blogHashtag.mapper';

export const getBlogHashTags = (params?: Record<string, any>): Promise<AxiosResponse<BlogHashtag[]>> => {
  return API.get<BlogHashtagDTO[]>('/v1/blog/hashtags', { ...params }, { baseURL: DIR_URL }).then((response) => ({
    ...response,
    data: BlogHashtagsMapper(response.data),
  }));
};

export const getBlogPopularHashTags = (params?: Record<string, any>): Promise<AxiosResponse<BlogHashtag[]>> => {
  return API.get<BlogHashtagDTO[]>('/v1/blog/hashtags/popular', { ...params }, { baseURL: DIR_URL }).then(
    (response) => ({
      ...response,
      data: BlogHashtagsMapper(response.data),
    }),
  );
};

export const getBlogHashTag = (slug: string): Promise<AxiosResponse<BlogHashtag>> => {
  return API.get<BlogHashtagDTO>(`/v1/blog/hashtags/alias/${slug}`, {}, { baseURL: DIR_URL }).then((response) => ({
    ...response,
    data: BlogHashtagMapper({}, response.data),
  }));
};

import { AxiosResponse } from 'axios';
import { BlogCategories } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { BlogCategoriesDTO } from '../types/dtos/blogCategories.dto';
import { BlogCategoriesMapper } from './mappers/blogCategories.mapper';

export const getBlogCategories = (params?: Record<string, any>): Promise<AxiosResponse<BlogCategories>> => {
  return API.get<BlogCategoriesDTO>('/v1/blog/categories', { ...params }, { baseURL: DIR_URL }).then((response) => ({
    ...response,
    data: BlogCategoriesMapper(response.data),
  }));
};

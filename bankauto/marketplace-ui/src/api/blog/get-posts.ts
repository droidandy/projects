import API, { RequestConfig } from 'api/request';
import { BlogPosts } from '@marketplace/ui-kit/types';
import { AxiosResponse } from 'axios';

export type Params = {
  page?: number;
  limit?: number;
  isMain?: boolean;
  isPromo?: boolean;
  categories?: string[];
  _hashtags?: string[];
};

const paramMapper = ({ page, limit = 4, isMain = true, isPromo, categories, _hashtags }: Params) => {
  return {
    page,
    limit,
    is_main: typeof isMain === 'boolean' && isMain ? 1 : 0 || undefined,
    is_promo: typeof isPromo === 'boolean' && isPromo ? 1 : 0 || undefined,
    categories,
    _hashtags,
  };
};

function getPosts(requestConfig?: RequestConfig, params?: Params): Promise<AxiosResponse<BlogPosts>> {
  return API.get('/blog/posts', paramMapper(params ?? {}), requestConfig);
}

export { getPosts };

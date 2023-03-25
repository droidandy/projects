import API from 'api/request';
import { BlogCategories } from '@marketplace/ui-kit/types';
import { AxiosResponse } from 'axios';

function getBlogCategories(): Promise<AxiosResponse<BlogCategories>> {
  return API.get('/blog/categories');
}

export { getBlogCategories };

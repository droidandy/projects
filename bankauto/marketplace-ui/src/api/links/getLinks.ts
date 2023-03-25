import API, { CancellableAxiosPromise } from 'api/request';
import { LinkItem } from '@marketplace/ui-kit/types';

const getLinks = (path: string): CancellableAxiosPromise<LinkItem[]> => {
  return API.get('/links/list', { path });
};

export { getLinks };

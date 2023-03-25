import API, { CancellableAxiosPromise } from 'api/request';

export const getFullLink = (hash: string): CancellableAxiosPromise<{ originalUrl: string }> => {
  return API.get(`marketing/short-link/original-link/${hash}`);
};

import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';

export const getFullLink = (hash: string): Promise<AxiosResponse<{ originalUrl: string }>> => {
  return API.get<{ originalUrl: string }>(
    `/v1/marketing/short-link/original-link/${hash}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((res) => {
    return res;
  });
};

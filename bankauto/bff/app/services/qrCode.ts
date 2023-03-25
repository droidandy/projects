import { AxiosResponse } from 'axios';
import API, { APPLICATION_URL } from '../config';

export const getQrCode = (url: string): Promise<AxiosResponse<string>> => {
  return API.get(
    '/qrcode/get-code',
    { text: url },
    {
      baseURL: APPLICATION_URL,
    },
  );
};

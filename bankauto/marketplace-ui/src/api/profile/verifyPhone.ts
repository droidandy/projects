import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';

export const verifyPhone = (phone: string, code: string): CancellableAxiosPromise<Token & { expiresIn: number }> => {
  return API.post(
    '/user/verify/phone',
    {
      phone,
      code,
    },
    {
      withCredentials: true,
    },
  );
};

export const sendVerifyPhoneCode = (phone: string): CancellableAxiosPromise => {
  return API.post('/user/verify/phone/code', {
    phone,
  });
};

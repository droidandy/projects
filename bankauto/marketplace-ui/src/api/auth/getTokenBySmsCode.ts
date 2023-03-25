import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';
import { getCookieConfirmationToken } from 'helpers/authCookies';

function getTokenBySmsCode(phone: string, code: string): CancellableAxiosPromise<Token & { expiresIn: number }> {
  console.log(process.env.CLIENT_ID);
  return API.post(
    '/phone-login',
    {
      phone,
      code,
      token: getCookieConfirmationToken(),
      clientId: process.env.CLIENT_ID,
    },
    {
      withCredentials: true,
    },
  );
}

export { getTokenBySmsCode };

import { Token } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';

function refreshToken(): CancellableAxiosPromise<Token & { expiresIn: number }> {
  return API.post(
    '/auth/refresh',
    {
      clientId: process.env.CLIENT_ID,
    },
    {
      ignoreFlashMessage: true,
      withCredentials: true,
    },
  );
}

export { refreshToken };

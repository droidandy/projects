import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';
import { AxiosError } from 'axios';

function getToken(phone: string, password: string): CancellableAxiosPromise<Token & { expiresIn: number }> {
  return API.post(
    '/auth/login',
    {
      username: phone,
      password,
      clientId: process.env.CLIENT_ID,
    },
    {
      withCredentials: true,
      errorMessage: (error: AxiosError) =>
        error.response?.status === 401 ? 'Неверный логин или пароль' : error.response?.data?.message,
    },
  );
}

export { getToken };

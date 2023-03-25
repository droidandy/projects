import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';

function resendAuthSms(): CancellableAxiosPromise<Token & { expiresIn: number; retryTimeout: number; ttl: number }> {
  return API.post(
    '/resend-sms',
    {},
    {
      withCredentials: true,
    },
  );
}

export { resendAuthSms };

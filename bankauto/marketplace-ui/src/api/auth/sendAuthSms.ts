import API, { CancellableAxiosPromise } from 'api/request';
import { Token } from '@marketplace/ui-kit/types';

function sendAuthSms(
  phone: string,
): CancellableAxiosPromise<Token & { expiresIn: number; retryTimeout: number; ttl: number }> {
  return API.post('/send-sms', {
    phone,
  });
}

export { sendAuthSms };

import API, { CancellableAxiosPromise } from 'api/request';
import { User } from '@marketplace/ui-kit/types';

function getProfile(): CancellableAxiosPromise<User> {
  return API.get(
    '/user/profile',
    {},
    {
      authRequired: true,
    },
  );
}

export { getProfile };

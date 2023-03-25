import API, { CancellableAxiosPromise } from 'api/request';

export const setEmail = (email: string): CancellableAxiosPromise<void> =>
  API.put(
    '/user/email/change',
    { email },
    {
      authRequired: true,
    },
  );

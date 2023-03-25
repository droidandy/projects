import API, { CancellableAxiosPromise } from 'api/request';

function verifyEmail(token: string): CancellableAxiosPromise<void> {
  return API.post(
    '/user/verify/email',
    {
      token,
    },
    { authRequired: true },
  );
}

export { verifyEmail };

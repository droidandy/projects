import API, { CancellableAxiosPromise } from 'api/request';

function removeToken(): CancellableAxiosPromise {
  return API.post(
    '/auth/logout',
    {},
    {
      withCredentials: true,
    },
  );
}

export { removeToken };

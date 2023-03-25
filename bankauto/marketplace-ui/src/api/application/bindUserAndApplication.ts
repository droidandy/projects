import API, { CancellableAxiosPromise } from 'api/request';

export function bindUserAndApplication(): CancellableAxiosPromise<void> {
  return API.put(
    '/application/bind-user',
    {},
    {
      authRequired: true,
    },
  );
}

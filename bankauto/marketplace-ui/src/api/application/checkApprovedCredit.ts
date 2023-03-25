import API, { CancellableAxiosPromise } from 'api/request';

export function checkApprovedCredit(): CancellableAxiosPromise<{ exists: boolean }> {
  return API.get(
    '/application/check-approved-credit',
    {},
    {
      authRequired: true,
    },
  );
}

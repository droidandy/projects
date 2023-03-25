import API, { CancellableAxiosPromise } from 'api/request';

function getSuggestedAddresses(query: string): CancellableAxiosPromise<any[]> {
  return API.post(
    '/suggest/address',
    {
      query,
    },
    {},
  );
}

export { getSuggestedAddresses };

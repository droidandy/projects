import API, { CancellableAxiosPromise } from 'api/request';

function getSuggestedEmployees(query: string): CancellableAxiosPromise<any[]> {
  return API.post(
    '/suggest/party',
    {
      query,
    },
    {},
  );
}

export { getSuggestedEmployees };

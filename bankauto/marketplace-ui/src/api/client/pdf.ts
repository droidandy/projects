import API, { CancellableAxiosPromise } from 'api/request';

export const createContractPdf = (params: Record<string, any>): CancellableAxiosPromise<{ url: string }> => {
  return API.post('/client/pdf/create/contract', params);
};

import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';

export function createContractPdf(params: Record<string, any>): Promise<AxiosResponse<{ url: string }>> {
  return API.post<any & { dkp_agreement: string }>(
    '/v1/dkp',
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then((response) => {
    if (response.data.status === 'error' || response.data.errors?.length) {
      throw new Error(response.data.errors.join('; '));
    }
    return { ...response, data: { url: response.data.dkp_agreement } };
  });
}

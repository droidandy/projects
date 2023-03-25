import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';

export const getAutotekaReportLink = (vehicleId: string): Promise<AxiosResponse<{ url: string }>> => {
  return API.get<{ url: string }>(
    `/v1/autoteka/${vehicleId}/get-buy-report-link`,
    {},
    {
      baseURL: DIR_URL,
    },
  );
};

import { AuthHeaders } from '../utils/authHelpers';
import { AxiosResponse } from 'axios';
import { Insurance } from '@marketplace/ui-kit/types';
import API, { APPLICATION_URL } from '../config';
import { InsuranceDto } from '../types/dtos/insurance.dto';
import { InsuranceMapper } from './mappers/insurance.mapper';

export const getInsurances = (auth: AuthHeaders): Promise<AxiosResponse<Insurance[]>> => {
  return API.get<{ data: InsuranceDto[] }>(
    '/applications/external-insurance',
    {},
    {
      headers: auth,
      baseURL: APPLICATION_URL,
    },
  ).then((response) => ({ ...response, data: response.data.data.map((dto) => InsuranceMapper({}, dto)) }));
};

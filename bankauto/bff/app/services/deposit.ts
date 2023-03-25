import { DepositRates } from '@marketplace/ui-kit/types';
import { AxiosResponse } from 'axios';
import { DepositRatesDTO } from 'types/dtos/deposit.dto';
import { DepositRateMapper } from './mappers/deposit.mapper';

import API, { DIR_URL } from '../config';

export const getDepositRates = (params: Record<string, any>): Promise<AxiosResponse<DepositRates>> => {
  return API.get<DepositRatesDTO>(
    '/v1/deposit/rates',
    { ...params },
    {
      baseURL: DIR_URL,
    },
  ).then(async (response) => {
    return {
      ...response,
      data: DepositRateMapper({}, response.data),
    };
  });
};

import { AxiosResponse } from 'axios';
import { AuthHeaders } from '../utils/authHelpers';
import API, { DIR_URL } from '../config';

export const getVehiclePrice = (params: Record<string, any>, auth: AuthHeaders): Promise<AxiosResponse<any>> => {
  return API.get(
    '/v1/vehicle/autostat',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
  }));
};

export const getVehiclePriceByParams = (
  params: Record<string, any>,
  auth: AuthHeaders,
): Promise<AxiosResponse<any>> => {
  return API.get(
    '/v1/vehicle/autostat/price-by-params',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({
    ...response,
  }));
};

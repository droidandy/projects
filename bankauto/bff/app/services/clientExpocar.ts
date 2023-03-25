import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from 'utils/authHelpers';

export const getInspectionsVehicle = (auth: AuthHeaders): Promise<AxiosResponse<any>> => {
  return API.get(
    '/v1/expocar/mine',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => {
    return { ...response };
  });
};

export const removeInspectionVehicle = (id: number | string, auth: AuthHeaders): Promise<AxiosResponse<any>> => {
  return API.delete(
    `/v1/expocar/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response }));
};

export const createInspectionVehicle = (vehicleId: number | string, auth: AuthHeaders): Promise<AxiosResponse<any>> => {
  return API.post(
    '/v1/expocar/create',
    { vehicleId },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response }));
};

export const checkPresetnExpocarInCity = (cityId: number | string): Promise<AxiosResponse<any>> => {
  return API.get(
    `/v1/expocar/available-city/${cityId}`,
    {},
    {
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response }));
};

export const getInspectionByVehicleId = (
  vehicleId: number | string,
  auth: AuthHeaders,
): Promise<AxiosResponse<any>> => {
  return API.get(
    `/v1/expocar/inspection-for-vehicle/${vehicleId}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response }));
};

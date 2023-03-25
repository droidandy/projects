import { AxiosResponse } from 'axios';
import { Vehicle, VehicleCount, Count } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { VehicleDTO } from '../types/dtos/vehicle.dto';
import { VehicleMapper } from './mappers/vehicle.mapper';
import { AuthHeaders } from '../utils/authHelpers';

const mapper = (dto: VehicleDTO): Vehicle => VehicleMapper({}, dto);

export const getDealerVehicle = (auth: AuthHeaders, id: string | number): Promise<AxiosResponse<Vehicle | null>> => {
  return API.get<VehicleDTO | null>(
    `/v1/dealer/vehicles/vehicle/${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  ).then((response) => ({ ...response, data: response.data ? mapper(response.data) : null }));
};

export const getDealerVehicles = (props: any, auth: AuthHeaders): Promise<AxiosResponse<Vehicle[]>> => {
  return API.get<VehicleDTO[]>('/v1/dealer/vehicles', props, {
    headers: auth,
    baseURL: DIR_URL,
  }).then((response) => ({ ...response, data: response.data.map(mapper) }));
};

export const getDealerVehiclesCount = (auth: AuthHeaders): Promise<AxiosResponse<VehicleCount>> => {
  return API.get<VehicleCount>(
    '/v1/dealer/vehicles/count',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const getDealerAppCount = (auth: AuthHeaders): Promise<AxiosResponse<Count>> => {
  return API.get<Count>(
    '/v1/dealer/vehicles/app-count',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const getDealerViewsCount = (auth: AuthHeaders): Promise<AxiosResponse<Count>> => {
  return API.get<Count>(
    '/v1/dealer/vehicles/views-count',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

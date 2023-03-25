import { ComparisonIds, VehiclesComparisonNew, VehiclesComparisonUsed } from '@marketplace/ui-kit/types';
import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import { ComparisonIdsDTO, VehiclesComparisonNewDTO, VehiclesComparisonUsedDTO } from 'types/dtos/comparison.dto';
import {
  ComparisonIdsMapper,
  VehicleComparisonNewMapper,
  VehicleComparisonUsedMapper,
} from '../services/mappers/comparison.mapper';

export const getComparisonIds = async (auth: AuthHeaders): Promise<AxiosResponse<ComparisonIds>> => {
  const response = await API.get<ComparisonIdsDTO>(
    '/v1/client/compare',
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
  return { ...response, data: ComparisonIdsMapper(response.data) };
};

export const updateComparisonIds = async (
  auth: AuthHeaders,
  data: ComparisonIds,
): Promise<AxiosResponse<ComparisonIds>> => {
  const response = await API.post<ComparisonIdsDTO>('/v1/client/compare', data, {
    headers: auth,
    baseURL: DIR_URL,
  });
  return { ...response, data: ComparisonIdsMapper(response.data) };
};

export const getComparisonVehiclesNew = async (offerIds: any): Promise<AxiosResponse<VehiclesComparisonNew>> => {
  const response = await API.get<VehiclesComparisonNewDTO>(
    '/v1/vehicle/compare/new',
    { id: offerIds },
    {
      baseURL: DIR_URL,
    },
  );
  return { ...response, data: { ...response.data, vehicles: response.data.vehicles.map(VehicleComparisonNewMapper) } };
};

export const getComparisonVehiclesUsed = async (offerIds: any): Promise<AxiosResponse<VehiclesComparisonUsed>> => {
  const response = await API.get<VehiclesComparisonUsedDTO>(
    '/v1/vehicle/compare/used',
    { id: offerIds },
    {
      baseURL: DIR_URL,
    },
  );
  return { ...response, data: { ...response.data, vehicles: response.data.vehicles.map(VehicleComparisonUsedMapper) } };
};

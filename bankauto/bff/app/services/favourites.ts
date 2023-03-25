import { AuthHeaders } from 'utils/authHelpers';
import { AxiosResponse } from 'axios';
import { VehicleShort } from '@marketplace/ui-kit/types';
import API, { DIR_URL } from '../config';
import { VehicleDTOShort } from '../types/dtos/newVehicle.dto';
import { VehicleMapperShort } from './mappers/newVehicle.mapper';

const vehicleShortMapper = (dto: VehicleDTOShort): VehicleShort => VehicleMapperShort({}, dto);

export const getFavourites = (auth: AuthHeaders): Promise<AxiosResponse<VehicleShort[]>> =>
  API.get<VehicleDTOShort[]>('/v1/client/vehicles/favorites', {}, { headers: auth, baseURL: DIR_URL }).then(
    (response) => {
      return { ...response, data: response.data.map(vehicleShortMapper) };
    },
  );

export const addToFavourites = (auth: AuthHeaders, data: Record<string, any>): Promise<AxiosResponse> =>
  API.post(
    '/v1/client/vehicles/favorites',
    {
      ...data,
    },
    { headers: auth, baseURL: DIR_URL },
  );

export const removeFromFavourites = (auth: AuthHeaders, data: Record<string, any>): Promise<AxiosResponse> =>
  API.delete(
    '/v1/client/vehicles/favorites',
    {
      ...data,
    },
    { headers: auth, baseURL: DIR_URL },
  );

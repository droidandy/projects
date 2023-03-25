import API, { CancellableAxiosPromise } from 'api/request';
import { VehicleShort } from '@marketplace/ui-kit/types';

export const getFavourites = (): CancellableAxiosPromise<VehicleShort[]> =>
  API.get<VehicleShort[]>(
    '/client/favourites',
    {},
    {
      authRequired: true,
    },
  );

export const addToFavourites = (vehicleId: number): CancellableAxiosPromise =>
  API.post(
    '/client/favourites',
    {
      vehicle_id: vehicleId,
    },
    {
      authRequired: true,
    },
  );

export const deleteFromFavourites = (vehicleId: number): CancellableAxiosPromise =>
  API.delete(
    '/client/favourites',
    {
      vehicle_id: vehicleId,
    },
    {
      authRequired: true,
    },
  );

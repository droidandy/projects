import { ComparisonIds, VehiclesComparisonNew, VehiclesComparisonUsed } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';

export const getComparisonIds = (): CancellableAxiosPromise<ComparisonIds> =>
  API.get<ComparisonIds>(
    '/client/comparison/ids',
    {},
    {
      authRequired: true,
    },
  );

export const updateComparisonIds = (data: ComparisonIds): CancellableAxiosPromise<ComparisonIds> =>
  API.put<ComparisonIds>('/client/comparison/ids', data, {
    authRequired: true,
  });

export const getComparisonVehiclesNew = (offerIds: number[]): CancellableAxiosPromise<VehiclesComparisonNew> =>
  API.get('/client/comparison/vehicles-new', {
    id: offerIds,
  });

export const getComparisonVehiclesUsed = (offerIds: number[]): CancellableAxiosPromise<VehiclesComparisonUsed> =>
  API.get('/client/comparison/vehicles-used', {
    id: offerIds,
  });

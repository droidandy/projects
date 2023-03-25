import API, { CancellableAxiosPromise } from 'api/request';
import { VEHICLE_TYPE, Vehicle } from '@marketplace/ui-kit/types';
import { filterSearchParamsMapper, sortParamsMapper } from 'api/mappers';
import { VehicleFilterValues } from 'types/VehicleFilterValues';
import { VehicleSortType } from '../../types/VehicleSortTypes';

function getVehicles(
  carType: VEHICLE_TYPE,
  filterValues: VehicleFilterValues,
  sort: VehicleSortType,
  limit: number,
  offset: number,
): CancellableAxiosPromise<Vehicle[]> {
  return API.get(`/vehicle/list/${carType}`, {
    ...filterSearchParamsMapper(filterValues),
    ...sortParamsMapper(sort),
    limit,
    offset,
  });
}

export { getVehicles };

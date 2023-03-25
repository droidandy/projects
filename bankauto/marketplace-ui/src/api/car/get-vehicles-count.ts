import API, { CancellableAxiosPromise } from 'api/request';
import { VEHICLE_TYPE, VehicleCount } from '@marketplace/ui-kit/types';

import { VehicleFilterValues } from 'types/VehicleFilterValues';
import { filterSearchParamsMapper } from 'api/mappers';

function getVehiclesCount(
  carType: VEHICLE_TYPE,
  filterValues: VehicleFilterValues,
): CancellableAxiosPromise<VehicleCount> {
  return API.get(`/vehicle/list/${carType}/count`, filterSearchParamsMapper(filterValues));
}

export { getVehiclesCount };

import API, { CancellableAxiosPromise } from 'api/request';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { filterSearchParamsMapperNew, sortParamsMapper } from 'api/mappers';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { InstalmentVehiclesMeta, VehicleInstalmentListItem } from 'types/Vehicle';
import { VehiclesFilterData } from '@marketplace/ui-kit/types';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';

export const getInstalmentFilterData = (params: VehiclesFilterParams): CancellableAxiosPromise<VehiclesFilterData> => {
  return API.get('/instalment/filter-data', params);
};

export const getInstalmentVehiclesMeta = (
  filterValues: VehiclesFilterValues,
): CancellableAxiosPromise<InstalmentVehiclesMeta> => {
  return API.get('/instalment/list/meta', filterSearchParamsMapperNew(filterValues));
};

export const getInstalmentVehicles = (
  filterValues: VehiclesFilterValues,
  page: number,
  limit: number,
  sort: VehicleSortType | undefined = VehicleSortType.PRICE_ASC,
): CancellableAxiosPromise<VehicleInstalmentListItem[]> => {
  return API.get('/instalment/list', {
    ...filterSearchParamsMapperNew(filterValues),
    ...sortParamsMapper(sort),
    limit,
    offset: (page - 1) * limit,
  });
};

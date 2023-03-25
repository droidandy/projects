import API, { CancellableAxiosPromise, RequestConfig } from 'api/request';
import { VEHICLE_TYPE_ID, VehicleShort } from '@marketplace/ui-kit/types';
import { VehiclesMetaData } from 'types/VehicleMeta';
import { VehiclesFilterValues } from 'types/VehiclesFilterValues';
import { filterSearchParamsMapperNew, sortParamsMapper } from 'api/mappers';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';
import { VehicleAliasesInfo } from 'types/VehicleAlias';
import { VehiclesFilterDataWithSeller } from 'types/VehiclesFilterDataWithSeller';

export const getFilterData = (
  params: VehiclesFilterParams,
  requestConfig?: RequestConfig,
): CancellableAxiosPromise<VehiclesFilterDataWithSeller> => {
  return API.get('/catalog/data-new', params, requestConfig);
};

export const getVehiclesMeta = (
  filterValues: VehiclesFilterValues,
  requestConfig?: RequestConfig,
): CancellableAxiosPromise<VehiclesMetaData> => {
  return API.get('/vehicle/list/meta', filterSearchParamsMapperNew(filterValues), requestConfig);
};

export const getVehicles = (
  filterValues: VehiclesFilterValues,
  page: number,
  limit: number,
  sort: VehicleSortType | null,
): CancellableAxiosPromise<VehicleShort[]> => {
  const sortingDefault =
    `${filterValues.type}` === `${VEHICLE_TYPE_ID.NEW}` ? VehicleSortType.PRICE_ASC : VehicleSortType.CREATED_DESC;
  const params = {
    ...filterSearchParamsMapperNew(filterValues),
    ...sortParamsMapper(sort || sortingDefault),
    limit,
    offset: (page - 1) * limit,
  };

  return API.get('/vehicle/v1/list', params);
};

export const checkUrlAliases = (
  brand: string,
  model: string | null,
  generation?: string | null,
): CancellableAxiosPromise<VehicleAliasesInfo | null> => {
  const aliasUrl = [brand, model, generation].filter((item) => item).join('/');
  return API.get(`catalog/alias/check/${aliasUrl}`);
};

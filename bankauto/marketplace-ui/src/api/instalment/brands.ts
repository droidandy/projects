import { CatalogBrandsShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';

export const getInstalmentBrands = (
  type: VEHICLE_TYPE,
  params: { cityId: number[] | null },
): CancellableAxiosPromise<CatalogBrandsShort[]> => {
  return API.get('/instalment/brandsShort', { type, ...params });
};

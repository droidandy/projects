import API, { CancellableAxiosPromise } from 'api/request';
import { CatalogBrandsShort } from '@marketplace/ui-kit/types';

type CatalogBrandsParams = {
  cityId: number[] | null;
  distance: number;
};

export const getCatalogBrands = (
  params?: CatalogBrandsParams,
  type?: string | null,
): CancellableAxiosPromise<CatalogBrandsShort[]> => {
  return API.get(`/catalog/v1/brands${(type && `/${type}`) || ''}`, params);
};

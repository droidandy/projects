import API, { CancellableAxiosPromise } from 'api/request';
import { VEHICLE_TYPE, CatalogBrand } from '@marketplace/ui-kit/types';

function getBrand(type: VEHICLE_TYPE, brandId: string | number): CancellableAxiosPromise<CatalogBrand> {
  return API.get<CatalogBrand>(`/catalog/brand/${type}/${brandId}`);
}

export { getBrand };

import API, { CancellableAxiosPromise } from 'api/request';
import { VEHICLE_TYPE, CatalogBrandNode } from '@marketplace/ui-kit/types';

type CatalogBrands = CatalogBrandNode[];

function getBrands(type: VEHICLE_TYPE): CancellableAxiosPromise<CatalogBrands> {
  return API.get(`/catalog/brands/${type}`);
}

export { getBrands };

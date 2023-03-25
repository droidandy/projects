import API, { CancellableAxiosPromise } from 'api/request';
import { VehicleShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';

type Papamas = { cityId: number[] | null; distance: number; price_min?: number; price_max?: number };

function getBestOffers(type: VEHICLE_TYPE, params: Papamas): CancellableAxiosPromise<VehicleShort[]> {
  return API.get(`/vehicle/v1/best-offers/${type}`, params);
}

export { getBestOffers };

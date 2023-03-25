import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle } from '@marketplace/ui-kit/types';

function getVehiclesSimilar(offerId: string | number): CancellableAxiosPromise<Vehicle[]> {
  return API.get(`/vehicle/similar/${offerId}`);
}

export { getVehiclesSimilar };

import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle } from '@marketplace/ui-kit/types';

function getVehicle(offerId: string | number): CancellableAxiosPromise<Vehicle> {
  return API.get(`/vehicle/item/${offerId}`);
}

export { getVehicle };

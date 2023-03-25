import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle } from '@marketplace/ui-kit/types';

const getVehiclesBatch = (): CancellableAxiosPromise<Vehicle[]> => {
  return API.get('/vehicle/list');
};

export { getVehiclesBatch };

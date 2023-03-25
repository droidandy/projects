import API, { CancellableAxiosPromise } from 'api/request';
import { PUBLICATION_CANCEL_REASON, Vehicle } from '@marketplace/ui-kit/types';

export const deactivateClientVehicle = (
  id: number | string,
  cancelReason: PUBLICATION_CANCEL_REASON,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.put(
    `/client/vehicles/vehicle/${id}/deactivate`,
    { cancelReason },
    {
      authRequired: true,
    },
  );
};

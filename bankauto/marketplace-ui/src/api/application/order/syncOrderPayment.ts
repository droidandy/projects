import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit';
import API from '../../request';

type SyncOrderPaymentResponse = {
  vehicle: {
    status: APPLICATION_VEHICLE_STATUS;
  };
};

export const syncOrderPayment = (vehicleId: number): Promise<SyncOrderPaymentResponse> => {
  return API.get<SyncOrderPaymentResponse>(
    `/application/booking/status-by-vehicle/${vehicleId}`,
    {},
    {
      authRequired: true,
      ignoreFlashMessage: true,
    },
  ).then(({ data }) => data);
};

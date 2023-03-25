import API, { CancellableAxiosPromise } from 'api/request';
import { PaymentOrder } from '@marketplace/ui-kit/types';

export const createBookingOrder = (applicationId: number | string): CancellableAxiosPromise<PaymentOrder> => {
  return API.post(
    `/application/booking/order/${applicationId}`,
    {},
    {
      authRequired: true,
    },
  );
};

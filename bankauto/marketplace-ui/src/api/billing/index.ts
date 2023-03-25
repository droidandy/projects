import { PaymentOrder } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';

export const getOrderHoldUrl = (): CancellableAxiosPromise<string> => {
  return API.get(
    '/billing/hold-url',
    {},
    {
      authRequired: true,
    },
  );
};

export const debitOrder = (id: string | number): CancellableAxiosPromise<PaymentOrder> => {
  return API.post(
    `/debit/${id}`,
    {},
    {
      authRequired: true,
    },
  );
};

export const refundOrder = (id: string | number): CancellableAxiosPromise<PaymentOrder> => {
  return API.post(
    `/refund/${id}`,
    {},
    {
      authRequired: true,
    },
  );
};

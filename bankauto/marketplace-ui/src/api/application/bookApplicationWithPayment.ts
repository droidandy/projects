import API, { CancellableAxiosPromise } from '../request';

export const bookApplicationWithPayment = (vehicleId: number): CancellableAxiosPromise<void> => {
  return API.get(
    `/application/vehicle/${vehicleId}/book-with-payment`,
    {},
    {
      authRequired: true,
    },
  );
};

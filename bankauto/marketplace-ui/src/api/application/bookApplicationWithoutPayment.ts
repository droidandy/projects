import API, { CancellableAxiosPromise } from '../request';

export const bookApplicationWithoutPayment = (vehicleId: number): CancellableAxiosPromise<void> => {
  return API.get(
    `/application/vehicle/${vehicleId}/book-without-payment`,
    {},
    {
      authRequired: true,
    },
  );
};

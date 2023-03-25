import API, { CancellableAxiosPromise } from '../request';

export const cancelHolding = (vehicleId: number): CancellableAxiosPromise<void> => {
  return API.get(
    `/application/booking/hold-cancel/${vehicleId}`,
    {},
    {
      authRequired: true,
    },
  );
};

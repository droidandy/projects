import API, { CancellableAxiosPromise } from '../request';

export const getAutotekaReportLink = (vehicleId: number): CancellableAxiosPromise<{ url: string }> => {
  return API.get(`/autoteka/report/${vehicleId}`);
};

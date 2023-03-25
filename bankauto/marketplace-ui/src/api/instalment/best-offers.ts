import API, { CancellableAxiosPromise } from 'api/request';
import { VehicleInstalmentListItem } from 'types/Vehicle';

export const getInstalmentBestOffers = (params: {
  cityId: number[] | null;
}): CancellableAxiosPromise<VehicleInstalmentListItem[]> => {
  return API.get('/instalment/best-offers', params);
};

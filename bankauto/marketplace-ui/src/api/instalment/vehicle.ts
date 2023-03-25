import API, { CancellableAxiosPromise } from 'api/request';
import { VehicleInstalmentItem, VehicleInstalmentListItem } from 'types/Vehicle';

export const getInstalmentVehicle = (
  brandAlias: string,
  modelAlias: string,
  offerId: string | number,
): CancellableAxiosPromise<VehicleInstalmentItem> => {
  return API.get(`/instalment/item/${brandAlias}/${modelAlias}/${offerId}`);
};

export const getInstalmentVehicleRelatives = (
  id: string | number,
): CancellableAxiosPromise<VehicleInstalmentListItem[]> => {
  return API.get(`/instalment/similar/${id}`);
};

import API, { CancellableAxiosPromise } from 'api/request';
import { VehicleNew, VehicleShort, CreateVehicleOptions } from '@marketplace/ui-kit/types';
import { CreateVehicleDataParams, CreateVehicleDataDTO } from 'types/VehicleCreateNew';
import { ColorChooseItem } from 'types/VehicleChooseColor';

export const getVehicle = (
  brandAlias: string,
  modelAlias: string,
  offerId: string | number,
): CancellableAxiosPromise<VehicleNew> => {
  return API.get(`/vehicle/v1/item/${brandAlias}/${modelAlias}/${offerId}`);
};

export const getVehicleRelatives = (
  id: string | number,
  params: { cityId?: number | null; distance?: number | null },
): CancellableAxiosPromise<VehicleShort[]> => {
  return API.get(`/vehicle/v1/similar/${id}`, params);
};

export const getVehicleCreateData = (
  params: CreateVehicleDataParams,
): CancellableAxiosPromise<CreateVehicleDataDTO> => {
  return API.get<CreateVehicleDataDTO>('/vehicle/create-data', {
    ...params,
    catalog: 'avito',
  });
};

export const getVehicleEditData = (params: CreateVehicleDataParams): CancellableAxiosPromise<CreateVehicleDataDTO> => {
  return API.get<CreateVehicleDataDTO>('/vehicle/create-data', {
    ...params,
    catalog: 'bankauto',
  });
};

export const getVehicleCreateOptions = (): CancellableAxiosPromise<CreateVehicleOptions> => {
  return API.get<CreateVehicleOptions>('/vehicle/create-options');
};

export const getVehicleColors = (id: string | number): CancellableAxiosPromise<ColorChooseItem[]> => {
  return API.get<ColorChooseItem[]>(`/vehicle/v1/item-color/${id}`);
};
//deprecated
export const getAutotekaLink = (id: number): CancellableAxiosPromise<{ url: string }> => {
  return API.get(`/vehicle/v1/autoteka/${id}`);
};

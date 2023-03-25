import { StickerData } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from 'api/request';
import {
  VehicleFormDataParams,
  VehicleFormDataNode,
  VehicleFormDataGeneration,
  VehicleFormDataModification,
  VehicleFormDataColor,
  VehicleFormOptions,
  VehicleFormCatalogType,
} from 'types/VehicleFormType';

export interface CreateVehicleDataDTO {
  cities: VehicleFormDataNode[];
  brands: VehicleFormDataNode[];
  models: VehicleFormDataNode[];
  years: number[];
  generations: VehicleFormDataGeneration[];
  bodies: VehicleFormDataNode[];
  transmissions: VehicleFormDataNode[];
  engines: VehicleFormDataNode[];
  drives: VehicleFormDataNode[];
  modifications: VehicleFormDataModification[];
  colors: VehicleFormDataColor[];
}

export const getVehicleCreateData = (
  params: VehicleFormDataParams,
  catalogType: VehicleFormCatalogType,
): CancellableAxiosPromise<CreateVehicleDataDTO> => {
  return API.get<CreateVehicleDataDTO>('/vehicle/create-data', { ...params, catalog: catalogType });
};

export const getVehicleCreateStickers = (): CancellableAxiosPromise<StickerData[]> => {
  return API.get<StickerData[]>('/vehicle/stickers-data');
};

type OptionsResponse = { optionGroups: VehicleFormOptions };

export const getVehicleCreateOptions = (): CancellableAxiosPromise<VehicleFormOptions> => {
  return API.get<OptionsResponse>('/vehicle/create-options').then((response) => ({
    ...response,
    data: response.data.optionGroups,
  }));
};

import { AxiosError } from 'axios';
import { VEHICLE_SCENARIO } from '@marketplace/ui-kit/types';
import API, { CancellableAxiosPromise } from '../request';

export interface VehicleCreateContacts {
  timeFrom: number;
  timeTo: number;
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
}

export interface VehicleCreateUser {
  lastName: string | null;
  firstName: string;
  patronymicName: string | null;
  email: string | null;
}

export interface VehicleCreateAdvanced {
  productionYear: number;
  // identity
  number: string;
  vin?: string | null;
  // history
  condition: number;
  mileage: number;
  ownersNumber: number;
  // price
  price: number;
  estimatedCost?: number;
  // ad details
  scenario: VEHICLE_SCENARIO;
  comment?: string;
  draftScenario?: number;
}

export interface VehicleCreateEquipment {
  colorId: number;
  brandId: number;
  modelId: number;
  generationId: number;
  transmissionId: number;
  driveId: number;
  bodyTypeId: number;
  engineId: number;
}

export interface VehicleCreateImages {
  stsImages: string[];
  exteriorImages: string[];
}

type VehicleResidualData = {
  id?: number | null;
  cityId: number;
  videoUrl?: string | null;
};

export type VehicleCreateData = VehicleCreateEquipment & VehicleCreateAdvanced & VehicleResidualData;

export interface VehicleCreateParams {
  vehicle: VehicleCreateData;
  images: VehicleCreateImages | null;
  options?: number[];
  equipment: {
    avitoModificationId: number;
  };
  contacts: VehicleCreateContacts;
  user: VehicleCreateUser;
  stickersId?: number[] | null;
}

type SetOptionalParams<T> = { [K in keyof T]?: T[K] | null };

type SetOptionalParamsWithoutNecessary<T, K extends keyof T | string | number | symbol> = {
  [S in Exclude<keyof T, K>]?: T[S] | null;
} & { [J in Extract<keyof T, K>]: T[J] };

export type VehicleDraftEquipment = SetOptionalParamsWithoutNecessary<
  VehicleCreateEquipment,
  'brandId' | 'modelId' | 'bodyTypeId'
>;

export type VehicleDraftAdvanced = SetOptionalParamsWithoutNecessary<VehicleCreateAdvanced, 'productionYear'>;

export type VehicleDraftData = VehicleDraftEquipment & VehicleDraftAdvanced & VehicleResidualData;

export type VehicleDrafContacts = SetOptionalParams<VehicleCreateContacts>;

export interface VehicleDraft {
  vehicle: VehicleDraftData;
  images: VehicleCreateImages | null;
  options?: number[] | null;
  equipment: {
    avitoModificationId?: number | null;
  };
  contacts: VehicleDrafContacts;
  user: VehicleCreateUser;
  stickersId?: number[] | null;
}
export type VehicleOfferDraftOptions = {
  createdAt: number;
  forC2c: number;
  groupOptionId: number;
  id: number;
  name: string;
  sort: number;
  status: string;
  subGroupId: number | null;
  updatedAt: number;
};

export type VehicleOfferDraft = Omit<VehicleDraft, 'vehicle' | 'options'> & { vehicle: Required<VehicleDraftData> } & {
  options: VehicleOfferDraftOptions[];
};

type CreateSimleDraftParams = {
  cityId: number;
  brandId: number;
  modelId: number;
};

export type VehicleCallDraftEquipment = SetOptionalParams<VehicleCreateEquipment>;
export type VehicleCallDraftAdvanced = SetOptionalParams<VehicleCreateAdvanced>;

export type VehicleCallDraft = Omit<VehicleDraft, 'vehicle'> & {
  vehicle: VehicleCallDraftEquipment & VehicleCallDraftAdvanced & VehicleResidualData;
};

export const getClientVehicleDraft = (id: number): CancellableAxiosPromise<VehicleOfferDraft> => {
  return API.get(
    `/client/vehicle/draft/${id}`,
    {},
    {
      authRequired: true,
      errorMessage: (error: AxiosError) =>
        error.response?.data?.error ? error.response!.data!.error.message : 'Произошла ошибка. Попробуйте снова',
    },
  );
};

export const saveClientVehicleDraft = (data: VehicleDraft): CancellableAxiosPromise<VehicleDraft> => {
  return API.post('/client/vehicle/draft/create', data, {
    authRequired: true,
  });
};
export const updateClientVehicleDraft = (
  data: VehicleDraft,
  isABTest: boolean = false,
): CancellableAxiosPromise<VehicleDraft> => {
  return API.put(
    '/client/vehicle/draft/update',
    { ...data, vehicle: { ...data.vehicle, draftScenario: isABTest ? 1 : 0 } },
    {
      authRequired: true,
    },
  );
};

export const releaseClientVehicleDraft = (
  data: VehicleCreateParams,
  isABTest: boolean = false,
): CancellableAxiosPromise<VehicleDraft> => {
  return API.put(
    '/client/vehicle/draft/release',
    { ...data, vehicle: { ...data.vehicle, draftScenario: isABTest ? 1 : 0 } },
    {
      authRequired: true,
    },
  );
};

export const createClientVehicleSimpleDraft = (params: CreateSimleDraftParams): CancellableAxiosPromise => {
  return API.post('/client/vehicle/draft/simple-draft', params, {
    authRequired: true,
  });
};

export const createClientVehicleCallDraft = (params: VehicleCallDraft): CancellableAxiosPromise<VehicleCallDraft> => {
  return API.post('/client/vehicle/draft/call-draft', params, {
    authRequired: true,
  });
};

export const getClientVehicleStatistics = (vehicleId: number | string): CancellableAxiosPromise => {
  return API.get(
    `/client/vehicle/statistics/${vehicleId}`,
    {},
    {
      authRequired: true,
      errorMessage: (error: AxiosError) =>
        error.response?.data?.error ? error.response!.data!.error.message : 'Произошла ошибка. Попробуйте снова',
    },
  );
};

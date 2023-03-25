import API, { CancellableAxiosPromise } from 'api/request';
import { Vehicle, VEHICLE_CONDITION, VEHICLE_SCENARIO, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { VehicleCreateParams } from 'types/VehicleCreate';
import { VehicleCreateState } from 'store/types';
import { AxiosError } from 'axios';
import { VehicleWithContacts } from 'types/Vehicle';

function getClientVehicle(offerId: string | number): CancellableAxiosPromise<Vehicle> {
  return API.get(
    `/client/vehicle/item/${offerId}`,
    {},
    {
      authRequired: true,
    },
  );
}

function getClientVehicleExt(offerId: string | number): CancellableAxiosPromise<VehicleWithContacts> {
  return API.get(
    `/client/vehicle/itemExt/${offerId}`,
    {},
    {
      authRequired: true,
    },
  );
}

interface CreateTradeInVehicleParams {
  condition: VEHICLE_CONDITION;
  color: string;
  brand: string;
  model: string;
  generation: string;
  transmission: string;
  drive: string;
  body: string;
  engine: string;
  engine_hp: number;
  engine_volume: string;
  production_year: number;
  mileage: number;
  estimated_cost: number;
  city: string;
}

function createTradeInVehicle(params: CreateTradeInVehicleParams): CancellableAxiosPromise<{ id: number }> {
  return API.post(
    '/client/vehicle/create/trade-in',
    {
      ...params,
    },
    {
      authRequired: true,
    },
  );
}

export type Option = {
  id: number;
  subgroups: number[];
};

export interface CreateClientVehicleParams {
  uuid: string;
  type: VEHICLE_TYPE_ID;
  scenario: VEHICLE_SCENARIO;
  city: string;
  phone: string;
  number: string;
  vin: string;
  price: string;
  brand: string;
  model: string;
  generation: string;
  body: string;
  engine: string;
  transmission: string;
  drive: string;
  engine_volume: string;
  engine_hp: string;
  condition: VEHICLE_CONDITION;
  production_year: string;
  sts_url: string;
  mileage: string;
  images_url: string;
  color?: string;
  comment?: string;
  video_url?: string;
  owners_number?: number;
}

export const createClientVehicle = (
  params: CreateClientVehicleParams,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.post('/client/vehicle/create', params, {
    authRequired: true,
  });
};

export interface VehicleCreateExtContacts {
  time_from: number;
  time_to: number;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
}

export interface VehicleCreateExtUser {
  last_name: string | null;
  first_name: string;
  patronymic_name: string | null;
  email: string | null;
}

export interface VehicleCreateExtAdvanced {
  production_year: number;
  options: string;
  // identity
  number: string;
  vin?: string | undefined;
  // history
  condition: string;
  mileage: string;
  owners_number: number;
  // price
  price: number;
  estimated_cost?: number;
  // ad details
  scenario: string;
  comment?: string;
}

export interface VehicleCreateExtEquipment {
  city: string;
  brand: string;
  model: string;
  body: string;
  generation: string;
  drive: string;
  transmission: string;
  engine: string;
  engine_volume: string;
  engine_hp: string;
  color: string;
}

export interface VehicleCreateExtMedia {
  images_url: string;
  sts_url?: string;
  video_url?: string;
}

export interface VehicleCreateExtParams {
  vehicle: VehicleCreateExtEquipment & VehicleCreateExtAdvanced & VehicleCreateExtMedia;
  contacts: VehicleCreateExtContacts;
  user: VehicleCreateExtUser;
}

interface VehicleUpdateExtEquipment {
  city_id: number;
  brand_id: number;
  model_id: number;
  body_type_id: number;
  generation_id: number;
  drive_id: number;
  transmission_id: number;
  engine_id: number;
  equipment: {
    power: number;
    volume: string;
  };
  color_id: number;
}

export interface VehicleUpdateExtMedia {
  exterior_images: string[];
  video_url?: string;
  sts_images?: string[];
}

export interface VehicleUpdateExtParams {
  vehicle: VehicleUpdateExtEquipment & VehicleCreateExtAdvanced & VehicleUpdateExtMedia;
  contacts: VehicleCreateExtContacts;
}

export const createClientVehicleExt = (
  params: VehicleCreateExtParams,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.post('/client/vehicle/createExt', params, {
    authRequired: true,
    errorMessage: (error: AxiosError) =>
      error.response?.data?.error ? error.response!.data!.error.message : 'Произошла ошибка. Попробуйте снова',
  });
};

export const updateClientVehicleExt = (
  id: string | number,
  params: VehicleUpdateExtParams,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.put(`/client/vehicle/update/${id}`, params, {
    authRequired: true,
    errorMessage: (error: AxiosError) =>
      error.response?.data?.error ? error.response!.data!.error.message : 'Произошла ошибка. Попробуйте снова',
  });
};

const preparePayloadUpdate = (
  vehicleParams: VehicleCreateParams,
  formParams: VehicleCreateState,
  vehicle: Vehicle,
  autostatPrice: number,
) => {
  const { values, contacts } = formParams;
  return {
    vehicle: {
      color_id: vehicle.colorId,
      brand_id: vehicle.brandId,
      model_id: vehicle.modelId,
      generation_id: vehicle.generationId,
      transmission_id: vehicle.transmissionId,
      drive_id: vehicle.driveId,
      body_type_id: vehicle.bodyTypeId,
      engine_id: vehicle.engineId,
      production_year: vehicle.productionYear,
      mileage: +values.mileage!,
      number: vehicle.number,
      price: +values.price!,
      condition: +values.condition!,
      city_id: +values.city!,
      video_url: values.videoUrl,
      comment: '',
      owners_number: +values.ownersNumber!,
      estimated_cost: autostatPrice,
      sts_images: [...(values.stsFront || []), ...(values.stsBack || [])],
      exterior_images: [...(values.imagesExterior || []), ...(values.imagesInterior || [])],
      equipment: {
        power: vehicle.equipment.power,
        volume: vehicle.equipment.volume,
      },
      // uuid: vehicleParams.uuid,
      // type: vehicleParams.typeId!,
      scenario: Number(vehicleParams.scenario!),
      // city: '17849',
      // phone: contacts.phone!,
      vin: vehicle.vin || values.vin,
    },
    contacts: {
      time_from: contacts.meetFrom,
      time_to: contacts.meetTo,
    },
  };
};

export const editClientVehicle = (
  id: number,
  params: VehicleCreateParams,
  vehicleCreate: VehicleCreateState,
  vehicle: Vehicle,
  autostatPrice: number,
): CancellableAxiosPromise<any & { vehicle: Vehicle }> => {
  return API.put(`/client/vehicle/update/${id}`, preparePayloadUpdate(params, vehicleCreate, vehicle, autostatPrice), {
    authRequired: true,
  });
};

export { getClientVehicle, getClientVehicleExt, createTradeInVehicle };

import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';
import { VEHICLE_CONDITION, CreateVehicleOptions, CreateVehicleNode } from '@marketplace/ui-kit/types';

export type CreateVehicleModification = CreateVehicleNode & {
  power: number;
  transmission: number;
  volume: number;
};
export type CreateVehicleGeneration = CreateVehicleNode & {
  startYear: number;
  endYear: number;
};

export type CreateVehicleColor = CreateVehicleNode & {
  code: string;
};

export type CreateVehicleCity = {
  id: string;
  name: string;
};

export interface CreateVehicleDataDTO {
  brands: CreateVehicleNode[];
  models: CreateVehicleNode[];
  years: number[];
  generations: CreateVehicleGeneration[];
  bodies: CreateVehicleNode[];
  transmissions: CreateVehicleNode[];
  engines: CreateVehicleNode[];
  drives: CreateVehicleNode[];
  modifications: CreateVehicleModification[];
  cities: CreateVehicleCity[];
}

export interface CreateVehicleData {
  brands: AutocompleteOption[];
  models: AutocompleteOption[];
  years: AutocompleteOption[];
  conditions: AutocompleteOption<VEHICLE_CONDITION>[];
  modifications: CreateVehicleModification[];
  generations: CreateVehicleGeneration[];
  bodies: CreateVehicleNode[];
  transmissions: CreateVehicleNode[];
  engines: CreateVehicleNode[];
  drives: CreateVehicleNode[];
  cities: AutocompleteOption[];
  colors?: CreateVehicleColor[]; // Пока не обязательное поле, чтобы не сломать форму трейдин
}

export interface CreateVehicleDataWithOptions extends CreateVehicleData, CreateVehicleOptions {}

export interface CreateVehicleValues {
  city: string | null;
  brand: number | null;
  model: number | null;
  year: number | null;
  generationId: number | null;
  bodyId: number | null;
  transmissionId: number | null;
  engineId: number | null;
  driveId: number | null;
  modificationId: number | null;
  condition: VEHICLE_CONDITION | null;
  mileage: number | null;
  vin: string | null;
  price: number | null;
  colorId: number | null;
  videoUrl: string | null;
  imagesExterior: string[] | null;
  imagesInterior: string[] | null;
  stsFront: string[] | null;
  stsBack: string[] | null;
  ownersNumber: number | null;
  // stsImages: string[] | null;

  // OPTIONS
  [optionName: string]: any;
}

export interface CreateVehicleContacts {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  meetFrom: number | null;
  meetTo: number | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}

export interface CreateVehicleDataParams {
  brandId?: number;
  modelId?: number;
  year?: number;
  bodyTypeId?: number;
  generationId?: number;
  driveId?: number;
  transmissionId?: number;
  engineId?: number;
  colorId?: number;
  videoUrl?: string;
  stsImages?: string[];
  imagesExterior?: string[];
  imagesInterior?: string[];
  stsFront?: string[];
  stsBack?: string[];
  ownersNumber?: number;
}

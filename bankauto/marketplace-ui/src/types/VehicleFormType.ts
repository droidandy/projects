import { AuthenticationValues, RegistrationValues } from 'types/Authentication';

export type VehicleFormCatalogType = 'avito' | 'bankauto';

export enum VEHICLE_CONDITION {
  GREAT = '1',
  GOOD = '2',
  MIDDLE = '3',
  REPAIR_REQUIRED = '4',
}

export type VehicleFormDataOption = {
  label: string;
  value: any;
};

export type VehicleFormDataNode = {
  id: number;
  name: string;
};

export type VehicleFormOption = VehicleFormDataNode & {
  subgroups: VehicleFormDataNode[];
  multiChoice: boolean | null;
};

export type VehicleFormOptionGroup = VehicleFormDataNode & {
  options: VehicleFormOption[];
};

export type VehicleFormOptions = VehicleFormOptionGroup[];

export type VehicleFormDataModification = VehicleFormDataNode & {
  power: number;
  transmissionId: number;
  volume: string;
};

export type VehicleFormDataGeneration = VehicleFormDataNode & {
  startYear: number;
  endYear: number;
};

export type VehicleFormDataColor = VehicleFormDataNode & {
  code: string;
};

export interface VehicleFormDataParams {
  id?: number;
  brandId?: number;
  modelId?: number;
  year?: number;
  bodyTypeId?: number;
  generationId?: number;
  driveId?: number;
  transmissionId?: number;
  engineId?: number;
}

export type VehicleFormDynamicKeys =
  | 'city'
  | 'brand'
  | 'model'
  | 'year'
  | 'body'
  | 'generation'
  | 'engine'
  | 'drive'
  | 'transmission'
  | 'modification'
  | 'color';

export type VehicleFormDynamicProto = {
  [key in VehicleFormDynamicKeys]: any;
};

export interface VehicleFormDataDynamic extends VehicleFormDynamicProto {
  city: VehicleFormDataOption[];
  brand: VehicleFormDataOption[];
  model: VehicleFormDataOption[];
  year: VehicleFormDataOption[];
  body: VehicleFormDataNode[];
  generation: VehicleFormDataGeneration[];
  drive: VehicleFormDataNode[];
  transmission: VehicleFormDataNode[];
  engine: VehicleFormDataNode[];
  modification: VehicleFormDataModification[];
  color: VehicleFormDataColor[];
}

export type VehicleFormData = VehicleFormDataDynamic;

export interface VehicleFormValuesDynamic extends VehicleFormDynamicProto {
  city: number | null;
  brand: number | null;
  model: number | null;
  year: number | null;
  generation: number | null;
  body: number | null;
  transmission: number | null;
  engine: number | null;
  drive: number | null;
  color: number | null;
}

export interface VehicleFromValuesVIN {
  vin: string | null;
}

export interface VehicleFormValuesAdvanced extends VehicleFromValuesVIN {
  condition: number | null;
  mileage: number | null;
  ownersNumber: number | null;
  price: number | null;
}

export type VehicleFormValuesBase = VehicleFormValuesDynamic & VehicleFormValuesAdvanced;

export interface VehicleFormValuesMedia {
  videoUrl: string | null;
  imagesExterior: string | null;
  imagesInterior: string | null;
  stsFront: string | null;
  stsBack: string | null;
}

export interface VehicleFromStickers {
  stickers: number[] | null;
}

export interface VehicleFormValuesOptions {
  // OPTIONS
  [optionName: string]: any;
}
export interface VehicleFormSellValuesDescription {
  comment: string | null;
}

export interface VehicleFormSellValuesScenario {
  isC2B: boolean;
  isC2C: boolean;
}

export type VehicleFormValuesSell = VehicleFormValuesBase &
  VehicleFormValuesMedia &
  VehicleFormSellValuesScenario &
  VehicleFormValuesOptions &
  VehicleFormSellValuesDescription &
  VehicleFromStickers;

export interface VehicleFormSellValuesProfile extends AuthenticationValues, RegistrationValues {
  lastName: string | null;
  middleName: string | null;
}

export interface VehicleFormSellValuesMeeting {
  meetFrom: number | null;
  meetTo: number | null;
}

export type Location = [number, number];
export type AddressContainer = {
  address: string;
  location: Location;
};

export interface VehicleFormSellValuesAddress {
  address: AddressContainer | null;
}

export interface VehicleFormSellValuesAuthorization {
  authSuccess: number | null;
}

export interface VehicleFormSellValuesContacts
  extends VehicleFormSellValuesProfile,
    VehicleFormSellValuesMeeting,
    VehicleFormSellValuesAuthorization,
    VehicleFormSellValuesAddress {}

export type VehicleFormSellValues = VehicleFormValuesSell & VehicleFormSellValuesContacts;

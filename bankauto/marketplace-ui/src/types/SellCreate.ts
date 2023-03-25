import { VehicleCreateFormValues } from './VehicleCreate';

export interface SellCreateMainValues {
  city: string | null;
  series: string | null;
  vin: string | null;
  phone: string | null;
}

export interface SellCreateVideo {
  video: string | null;
}

export interface SellCreateAdditional {
  comment: string | null;
  ownersNumber: number | null;
}

export interface Images {
  imagesExterior: string[] | null;
  imagesInterior: string[] | null;
  stsFront: string[] | null;
  stsBack: string[] | null;
}

export enum SellCreateAB {
  USER = 'user',
  CALL_CENTER = 'call-center',
}

export type SellCreateFormValues = SellCreateMainValues &
  SellCreateVideo &
  VehicleCreateFormValues &
  Images &
  SellCreateAdditional;

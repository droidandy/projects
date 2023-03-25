import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';

export interface VehicleMeta {
  main: JSX.Element | string;
  secondary: JSX.Element | string;
  tip?: string;
  carType?: VEHICLE_TYPE;
}

export type VehiclesMetaData = {
  vehiclesCount: number;
  count: number;
  minPrice: number;
  description?: string;
  seoText?: string;
};

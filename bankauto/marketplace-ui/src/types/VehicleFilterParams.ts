import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

export interface VehiclesFilterParams {
  specialOfferId?: number[] | number;
  brandId?: number[] | number;
  modelId?: number[] | number;
  generationId?: number[];
  type?: VEHICLE_TYPE_ID | null;
  cityId?: number[] | null;
}

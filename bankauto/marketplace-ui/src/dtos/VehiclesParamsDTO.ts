import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { SELLER_TYPE } from 'types/VehiclesFilterValues';

export interface VehiclesParamsDTO {
  type?: VEHICLE_TYPE_ID;
  specialOfferId?: number[];
  brandId?: number[];
  modelId?: number[];
  generationId?: number[];
  equipmentId?: number;
  withGift?: number;
  priceFrom?: number;
  priceTo?: number;
  bodyTypeId?: number[];
  transmissionId?: number[];
  engineId?: number[];
  mileageFrom?: number;
  mileageTo?: number;
  driveId?: number[];
  productionYearFrom?: number;
  productionYearTo?: number;
  powerFrom?: number;
  powerTo?: number;
  volumeFrom?: number;
  volumeTo?: number;
  limit?: number;
  offset?: number;
  basicColorId?: number[];
  installmentMonths?: number;
  sellerType?: SELLER_TYPE | null;
  cityId?: number[];
  distance?: number;
  salesOfficeId?: number[] | null;

  installmentMonthlyPaymentFrom?: number;
  installmentMonthlyPaymentTo?: number;
}

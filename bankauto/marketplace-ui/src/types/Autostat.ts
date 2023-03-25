import { VehicleFormCatalogType } from 'types/VehicleFormType';

export interface AutostatParams {
  vin: string | null;
  mileage?: number | null;
  transmission?: number | null;
  condition?: number | null;
}

export interface AutostatParamsAccurate {
  catalog?: VehicleFormCatalogType;
  brand: number;
  model: number;
  generation?: number | null;
  year: number;
  state: number;
  mileage: number;
}

export interface AutostatData {
  priceTradeIn: number | null;
  priceAvg: number | null;
  errors?: string;
}

export interface AutostatByParamsData {
  price: number;
}

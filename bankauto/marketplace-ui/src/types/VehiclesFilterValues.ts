import { AutocompleteOption } from 'components/Autocomplete/types';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

export enum SELLER_TYPE {
  PERSON = 'person',
  DEALER = 'dealer',
  ALL = 'all',
}

export type VehiclesFilterValues = {
  type?: VEHICLE_TYPE_ID | null;
  city: string;
  specialOffers: AutocompleteOption[] | null;
  brands: AutocompleteOption[] | null;
  models: AutocompleteOption[] | null;
  generations: AutocompleteOption[] | null;
  bodyTypes: AutocompleteOption[] | null;
  transmissions: AutocompleteOption[] | null;
  engines: AutocompleteOption[] | null;
  drives: AutocompleteOption[] | null;
  yearFrom: string | null;
  yearTo: string | null;
  priceFrom: string | null;
  priceTo: string | null;
  powerFrom: string | null;
  powerTo: string | null;
  volumeFrom: string | null;
  volumeTo: string | null;
  colors: number[] | null;
  mileageFrom: string | null;
  mileageTo: string | null;
  installmentMonths: string | null;
  sellerType: SELLER_TYPE | null;

  installmentMonthlyPaymentFrom: string | null;
  installmentMonthlyPaymentTo: string | null;
  salesOfficeId: number[] | null;
  [key: string]: boolean | VEHICLE_TYPE_ID | null | AutocompleteOption[] | string | number[] | undefined;
};

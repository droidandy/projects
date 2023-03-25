import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';

export interface VehicleFilterValues {
  city?: string;
  brand?: AutocompleteOption[];
  model?: AutocompleteOption[];
  generation?: AutocompleteOption[];
  priceFrom?: string;
  priceTo?: string;
  bodyType?: AutocompleteOption[];
  transmission?: AutocompleteOption[];
  engineType?: AutocompleteOption[];
  mileageFrom?: string;
  mileageTo?: string;
  driveType?: AutocompleteOption[];
  yearFrom?: string;
  yearTo?: string;
  powerFrom?: string;
  powerTo?: string;
  volumeFrom?: string;
  volumeTo?: string;
  trunkFrom?: string;
  clearanceFrom?: string;
  color?: number[];
  installmentMonths?: number;
  installmentMonthlyPaymentFrom?: number;
  installmentMonthlyPaymentTo?: number;
}

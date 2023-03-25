import { AutocompleteOption } from '@marketplace/ui-kit/components/Autocomplete';
import { VEHICLE_CONDITION, VEHICLE_SCENARIO, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

export interface VehicleCreateParams {
  uuid: string;
  typeId: VEHICLE_TYPE_ID | null;
  scenario: VEHICLE_SCENARIO | null;
}

export interface VehicleCreateFormName {
  brand: AutocompleteOption | null;
  model: AutocompleteOption | null;
  generation: AutocompleteOption | null;
}

export interface VehicleCreateFormMileage {
  mileage: number | null;
}

export interface VehicleCreateFormPrice {
  price: number | null;
}

export type VehicleCreateFormValues = VehicleCreateFormName &
  VehicleCreateFormMileage &
  VehicleCreateFormPrice & {
    city: string | null;
    year: AutocompleteOption | null;
    color: number | null;
    condition: VEHICLE_CONDITION | null;
    body: number | null;
    transmission: number | null;
    engine: number | null;
    drive: number | null;
    volume: AutocompleteOption | null;
    power: number | null;
    status: number | null;
    wheel: number | null;
    custom: number | null;
    ownersNumber: number | null;
    comment: string | null;
  };

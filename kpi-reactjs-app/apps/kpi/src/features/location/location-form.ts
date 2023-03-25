import { createForm } from 'typeless-form';
import { LocationFormSymbol } from './symbol';
import {
  validateString,
  validateNumber,
  validateBool,
} from 'src/common/helper';
import { SelectOption } from 'src/types';

export interface LocationFormValues {
  name_en: string;
  name_ar: string;
  address_en: string;
  address_ar: string;
  poBox: string;
  city: string;
  country: string;
  long: string;
  lat: string;
  isHeadquarter: SelectOption;
}

export const [
  useLocationForm,
  LocationFormActions,
  getLocationFormState,
  LocationFormProvider,
] = createForm<LocationFormValues>({
  symbol: LocationFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'name_ar');
    validateString(errors, values, 'address_en');
    validateString(errors, values, 'address_ar');
    validateString(errors, values, 'poBox');
    validateString(errors, values, 'city');
    validateString(errors, values, 'country');
    validateNumber(errors, values, 'long');
    validateNumber(errors, values, 'lat');
    validateBool(errors, values, 'isHeadquarter');
  },
});

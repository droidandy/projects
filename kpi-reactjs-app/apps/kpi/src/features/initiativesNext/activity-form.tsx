import { createForm } from 'typeless-form';
import { ActivityFormSymbol } from './symbol';
import {
  validateLangString,
  validateNumber,
  validateDate,
} from 'src/common/helper';

export interface ActivityFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  startDate: string;
  endDate: string;
  budget: number | null;
  skills: number[];
  [x: string]: any;
}

export const [
  useActivityForm,
  ActivityFormActions,
  getActivityFormState,
  ActivityFormProvider,
] = createForm<ActivityFormValues>({
  symbol: ActivityFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateDate(errors, values, 'startDate');
    validateDate(errors, values, 'endDate');
    validateNumber(errors, values, 'budget', true);
  },
});

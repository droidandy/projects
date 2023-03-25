import { createForm } from 'typeless-form';
import { ActionDetailsFormSymbol } from './symbol';
import { validateDate, validateLangString } from 'src/common/helper';

export interface ActionDetailsFormValues {
  name_en: string;
  name_ar: string;
  startDate: string;
  endDate: string;
}

export const [
  useActionDetailsForm,
  ActionDetailsFormActions,
  getActionDetailsFormState,
  ActionDetailsFormProvider,
] = createForm<ActionDetailsFormValues>({
  symbol: ActionDetailsFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateDate(errors, values, 'startDate');
    validateDate(errors, values, 'endDate');
  },
});

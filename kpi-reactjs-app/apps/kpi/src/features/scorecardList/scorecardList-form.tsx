import { createForm } from 'typeless-form';
import { SelectOption } from 'src/types';
import { ScorecardListFormSymbol } from './symbol';
import { validateString, validateOption } from 'src/common/helper';

export interface ScorecardListFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  unitId: SelectOption;
  strategicPlanId: number;
}

export const [
  useScorecardListForm,
  ScorecardListFormActions,
  getScorecardListFormState,
  ScorecardListFormProvider,
] = createForm<ScorecardListFormValues>({
  symbol: ScorecardListFormSymbol,
  validator: (errors, values) => {
    validateString(errors, values, 'name_ar');
    validateString(errors, values, 'name_en');
    validateString(errors, values, 'description_ar');
    validateString(errors, values, 'description_en');
    validateOption(errors, values, 'unitId');
  },
});

import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { InfoFormSymbol } from './symbol';
import {
  validateLangString,
  validateOption,
  validateDate,
  validateString,
  validateNumber,
} from 'src/common/helper';
import { Initiative, RelatedItem, RiskManagementItem } from 'src/types-next';

export interface InfoFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  updaters: number[];
  startDate: string;
  endDate: string;
  budget: number;
  currency: SelectOption;
  initiativeType: SelectOption;
  requireContracting: boolean;
  contractNumber: string;
  outcomes: number[];
  activities: Initiative[];
  relatedItems: RelatedItem[];
  risks: RiskManagementItem[];
  initiativeLevel: SelectOption;

  [x: string]: any;
}

export function getOutcomeKey(id: number, prop: 'value') {
  return `outcome_${id}_${prop}`;
}

export const [
  useInfoForm,
  InfoFormActions,
  getInfoFormState,
  InfoFormProvider,
] = createForm<InfoFormValues>({
  symbol: InfoFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'currency');
    validateDate(errors, values, 'startDate');
    validateDate(errors, values, 'endDate');
    validateString(errors, values, 'fullTimeEquivalent');
    validateOption(errors, values, 'initiativeType');
    validateOption(errors, values, 'initiativeLevel');
    validateString(errors, values, 'projectCode');
    validateNumber(errors, values, 'budget', true);
    if (values.requireContracting) {
      validateString(errors, values, 'contractNumber');
    }
  },
});

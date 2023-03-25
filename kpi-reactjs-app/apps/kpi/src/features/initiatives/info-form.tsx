import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { InfoFormSymbol } from './symbol';
import {
  validateLangString,
  validateOption,
  validateNumber,
  validateDate,
  validateString,
} from 'src/common/helper';
import { InitiativeItemType } from 'src/types-next';

export interface InfoFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  type: SelectOption;
  updaters: number[];
  startDate: string;
  endDate: string;
  budget: number;
  currency: SelectOption;
  requireContracting: boolean;
  contractNumber: string;
  outcomes: number[];
  skills: number[];

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
    validateOption(errors, values, 'type');
    validateOption(errors, values, 'currency');
    validateNumber(errors, values, 'budget');
    validateDate(errors, values, 'startDate');
    validateDate(errors, values, 'endDate');
    const type = values.type ? values.type.value : 0;
    if (type === InitiativeItemType.Activity) {
      //
    }
    if (type === InitiativeItemType.Initiative) {
      validateString(errors, values, 'fullTimeEquivalent');
      validateOption(errors, values, 'initiativeType');
      validateString(errors, values, 'projectCode');
      if (values.requireContracting) {
        validateString(errors, values, 'contractNumber');
      }
    }
  },
});

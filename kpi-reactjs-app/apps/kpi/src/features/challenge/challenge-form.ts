import { createForm } from 'typeless-form';
import { ChallengeFormSymbol } from './symbol';
import { validateOption, validateLangString } from 'src/common/helper';
import { SelectOption } from 'src/types';
import { PeriodFrequency } from 'src/types-next';

export interface ChallengeFormValues {
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  affectedUnit: SelectOption;
  challengedUnit: SelectOption;
  itemType: SelectOption;
  item: SelectOption;
  period_frequency: PeriodFrequency;
  period_year: number;
  period_number: number;
  actions: number[];
  [x: string]: any;
}

export function getActionProp(
  id: number,
  prop: 'name' | 'status' | 'startDate' | 'endDate'
) {
  return `action_${id}_${prop}`;
}

export function getActionData(id: number, values: ChallengeFormValues) {
  return {
    name: values[getActionProp(id, 'name')],
    status: values[getActionProp(id, 'status')],
    startDate: values[getActionProp(id, 'startDate')],
    endDate: values[getActionProp(id, 'endDate')],
  };
}

export const [
  useChallengeForm,
  ChallengeFormActions,
  getChallengeFormState,
  ChallengeFormProvider,
] = createForm<ChallengeFormValues>({
  symbol: ChallengeFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateLangString(errors, values, 'description');
    validateOption(errors, values, 'affectedUnit');
    validateOption(errors, values, 'challengedUnit');
    validateOption(errors, values, 'itemType');
    validateOption(errors, values, 'item');
  },
});

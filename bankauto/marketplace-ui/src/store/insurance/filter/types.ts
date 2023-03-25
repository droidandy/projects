import { InsuranceFilterFormValues } from 'types/Insurance';

export const SET_INSURANCE_FILTER_VALUES = 'SET_INSURANCE_FILTER_VALUES';

export interface SetInsuranceFilterValuesAction {
  type: typeof SET_INSURANCE_FILTER_VALUES;
  payload: InsuranceFilterFormValues;
}

export type FilterValuesActions = SetInsuranceFilterValuesAction;

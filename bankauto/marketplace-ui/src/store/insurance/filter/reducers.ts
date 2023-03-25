import { InsuranceFilterFormValues } from 'types/Insurance';
import { initialState } from 'store/initial-state';
import { FilterValuesActions, SET_INSURANCE_FILTER_VALUES } from './types';

function insuranceFilterValuesReducer(
  state: InsuranceFilterFormValues = initialState.insuranceFilterValues,
  { type, payload }: FilterValuesActions,
): InsuranceFilterFormValues {
  switch (type) {
    case SET_INSURANCE_FILTER_VALUES:
      return payload;
    default:
      return state;
  }
}

export { insuranceFilterValuesReducer };

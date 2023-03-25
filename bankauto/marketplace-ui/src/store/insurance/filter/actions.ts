import { InsuranceFilterFormValues } from 'types/Insurance';
import { SET_INSURANCE_FILTER_VALUES, SetInsuranceFilterValuesAction } from './types';

function setInsuranceFilterValues(filterValues: InsuranceFilterFormValues): SetInsuranceFilterValuesAction {
  return {
    type: SET_INSURANCE_FILTER_VALUES,
    payload: filterValues,
  };
}

export { SET_INSURANCE_FILTER_VALUES, setInsuranceFilterValues };

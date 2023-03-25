import * as types from '../constants';

export function getDisclaimerData(rfpQuoteOption) {
  return {
    payload: { rfpQuoteOption },
    type: types.GET_DISCLAIMERS_DATA,
  };
}

export function changeDisclaimerDropdownData(value) {
  return {
    type: types.CHANGE_DISCLAIMERS_DROPDOWN_DATA,
    payload: { value },
  };
}

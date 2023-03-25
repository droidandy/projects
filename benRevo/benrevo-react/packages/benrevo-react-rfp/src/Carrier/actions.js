import {
  CHECK_CENSUS_TYPE,
  RFP_SUBMIT,
  GET_RFP_STATUS,
} from '../constants';

export function submitRfp() {
  return {
    type: RFP_SUBMIT,
  };
}

export function checkTypeOfCensus() {
  return {
    type: CHECK_CENSUS_TYPE,
  };
}

export function getRFPStatus() {
  return {
    type: GET_RFP_STATUS,
  };
}

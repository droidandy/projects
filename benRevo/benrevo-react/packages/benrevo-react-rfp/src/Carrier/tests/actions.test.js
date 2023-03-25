import {
  submitRfp,
  checkTypeOfCensus,
  getRFPStatus,
} from '../actions';
import {
  RFP_SUBMIT,
  CHECK_CENSUS_TYPE,
  GET_RFP_STATUS,
} from '../../constants';

describe('RFP actions', () => {
  describe('sendRfpToCarrier', () => {
    it('has a type of ADD_CARRIER', () => {
      const expected = {
        type: RFP_SUBMIT,
      };
      expect(submitRfp('test')).toEqual(expected);
    });
  });

  describe('checkTypeOfCensus', () => {
    it('has a type of CHECK_CENSUS_TYPE', () => {
      const expected = {
        type: CHECK_CENSUS_TYPE,
      };
      expect(checkTypeOfCensus('test')).toEqual(expected);
    });
  });

  describe('getRFPStatus', () => {
    it('has a type of GET_RFP_STATUS', () => {
      const expected = {
        type: GET_RFP_STATUS,
      };
      expect(getRFPStatus('test')).toEqual(expected);
    });
  });
});

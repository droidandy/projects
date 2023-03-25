import {
  getCarrierEmailsList,
  changeApproveCarrier,
  deleteEmailFromCarrier,
  saveEmails,
  saveCarrierEmailList,
} from '../actions';
import {
  GET_CARRIER_EMAILS,
  CHANGE_APPROVE_CARRIER,
  DELETE_EMAIL_FROM_CARRIER,
  SAVE_EMAILS,
  UPDATE_CARRIER_EMAILS,
} from '../constants';

describe('Admin actions', () => {
  describe('getCarrierEmailsList', () => {
    it('has a type of GET_CARRIER_EMAILS', () => {
      const expected = {
        type: GET_CARRIER_EMAILS,
      };
      expect(getCarrierEmailsList()).toEqual(expected);
    });
  });
  describe('changeApproveCarrier', () => {
    it('has a type of CHANGE_APPROVE_CARRIER', () => {
      const value = '123';
      const carrierIndex = '234';
      const expected = {
        type: CHANGE_APPROVE_CARRIER,
        payload: { value, carrierIndex },
      };
      expect(changeApproveCarrier(value, carrierIndex)).toEqual(expected);
    });
  });
  describe('deleteEmailFromCarrier', () => {
    it('has a type of DELETE_EMAIL_FROM_CARRIER', () => {
      const carrierIndex = 1;
      const emailIndex = 2;
      const expected = {
        type: DELETE_EMAIL_FROM_CARRIER,
        payload: { carrierIndex, emailIndex },
      };
      expect(deleteEmailFromCarrier(carrierIndex, emailIndex)).toEqual(expected);
    });
  });
  describe('saveEmails', () => {
    it('has a type of SAVE_EMAILS', () => {
      const carrierIndex = 1;
      const emails = [];
      const expected = {
        type: SAVE_EMAILS,
        payload: { carrierIndex, emails },
      };
      expect(saveEmails(carrierIndex, emails)).toEqual(expected);
    });
  });
  describe('saveCarrierEmailList', () => {
    it('has a type of UPDATE_CARRIER_EMAILS', () => {
      const expected = {
        type: UPDATE_CARRIER_EMAILS,
      };
      expect(saveCarrierEmailList()).toEqual(expected);
    });
  });
});

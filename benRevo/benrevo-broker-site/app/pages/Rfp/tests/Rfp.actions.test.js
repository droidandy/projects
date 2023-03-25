import {
  changeRfpSent,
  selectClientsCarrier,
  getCarrierEmailsList,
  changeEmails,
  changeSelect,
} from '../actions';
import {
  CHANGE_RFP_SENT,
  SELECT_CLIENTS_CARRIER,
  GET_CARRIER_EMAILS,
  CHANGE_EMAILS,
  CHANGE_SELECT,
} from './../constants';

describe('Rfp actions', () => {
  describe('changeRfpSent', () => {
    const value = '1';
    it('has a type of CHANGE_RFP_SENT', () => {
      const expected = {
        type: CHANGE_RFP_SENT,
        payload: '1',
      };
      expect(changeRfpSent(value)).toEqual(expected);
    });
  });
  describe('selectClientsCarrier', () => {
    it('has a type of SELECT_CLIENTS_CARRIER', () => {
      const carrier = 'anthem';
      const section = 'medical';
      const products = '1';
      const expected = {
        type: SELECT_CLIENTS_CARRIER,
        payload: { carrier, section, products },
      };
      expect(selectClientsCarrier(carrier, section, products)).toEqual(expected);
    });
  });
  describe('getCarrierEmailsList', () => {
    it('has a type of GET_CARRIER_EMAILS', () => {
      const expected = {
        type: GET_CARRIER_EMAILS,
      };
      expect(getCarrierEmailsList()).toEqual(expected);
    });
  });
  describe('changeEmails', () => {
    it('has a type of CHANGE_EMAILS', () => {
      const carrier = 'medical';
      const emails = [];
      const expected = {
        type: CHANGE_EMAILS,
        payload: { carrier, emails },
      };
      expect(changeEmails(carrier, emails)).toEqual(expected);
    });
  });
  describe('changeSelect', () => {
    it('has a type of CHANGE_SELECT', () => {
      const carrierId = 1;
      const product = 'product';
      const selected = '123';
      const expected = {
        type: CHANGE_SELECT,
        payload: { carrierId, product, selected },
      };
      expect(changeSelect(carrierId, product, selected)).toEqual(expected);
    });
  });
});

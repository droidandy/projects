import * as actions from '../actions';
import * as types from '../constants';

describe('Accounts actions test', () => {
  describe('requestsGet', () => {
    it('has a type of REQUESTS_GET', () => {
      const expected = {
        type: types.REQUESTS_GET,
      };
      expect(actions.requestsGet()).toEqual(expected);
    });
  });
  describe('gaGets', () => {
    it('has a type of GA_GET', () => {
      const expected = {
        type: types.GA_GET,
      };
      expect(actions.gaGets()).toEqual(expected);
    });
  });
  describe('contactsGets', () => {
    it('has a type of CONTACTS_GET', () => {
      const expected = {
        type: types.CONTACTS_GET,
      };
      expect(actions.contactsGets()).toEqual(expected);
    });
  });
  describe('brokerageGets', () => {
    it('has a type of BROKERAGE_GET', () => {
      const expected = {
        type: types.BROKERAGE_GET,
      };
      expect(actions.brokerageGets()).toEqual(expected);
    });
  });
  describe('selectRequest', () => {
    it('has a type of SELECT_REQUEST', () => {
      const request = {};
      const expected = {
        type: types.SELECT_REQUEST,
        payload: request,
      };
      expect(actions.selectRequest(request)).toEqual(expected);
    });
  });
  describe('setRouteError', () => {
    it('has a type of SET_ERROR', () => {
      const status = {};
      const expected = {
        type: types.SET_ERROR,
        payload: status,
      };
      expect(actions.setRouteError(status)).toEqual(expected);
    });
  });
  describe('changeField', () => {
    it('has a type of CHANGE_FIELD', () => {
      const key = '123';
      const value = '234';
      const expected = {
        type: types.CHANGE_FIELD,
        payload: { key, value },
      };
      expect(actions.changeField(key, value)).toEqual(expected);
    });
  });
  describe('changeInfo', () => {
    it('has a type of CHANGE_INFO', () => {
      const key = '123';
      const value = '234';
      const expected = {
        type: types.CHANGE_INFO,
        payload: { key, value },
      };
      expect(actions.changeInfo(key, value)).toEqual(expected);
    });
  });
  describe('saveInfo', () => {
    it('has a type of SAVE_INFO', () => {
      const expected = {
        type: types.SAVE_INFO,
      };
      expect(actions.saveInfo()).toEqual(expected);
    });
  });
  describe('cancelChangeInfo', () => {
    it('has a type of CANCEL_CHANGE_INFO', () => {
      const expected = {
        type: types.CANCEL_CHANGE_INFO,
      };
      expect(actions.cancelChangeInfo()).toEqual(expected);
    });
  });
  describe('approve', () => {
    it('has a type of APPROVE', () => {
      const expected = {
        type: types.APPROVE,
      };
      expect(actions.approve()).toEqual(expected);
    });
  });
  describe('decline', () => {
    it('has a type of DECLINE', () => {
      const expected = {
        type: types.DECLINE,
      };
      expect(actions.decline()).toEqual(expected);
    });
  });
});

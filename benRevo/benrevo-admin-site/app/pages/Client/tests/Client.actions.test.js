import * as actions from '../actions';
import * as types from './../constants';

describe('Client actions', () => {
  describe('changeCarrier', () => {
    it('has a type of CHANGE_CARRIERS', () => {
      const carrier = 'ANTHEM';
      const expected = {
        type: types.CHANGE_CARRIERS,
        payload: carrier,
      };
      expect(actions.changeCarrier(carrier)).toEqual(expected);
    });
  });

  describe('changeBrokers', () => {
    it('has a type of CHANGE_BROKERS', () => {
      const broker = { name: '123' };
      const expected = {
        type: types.CHANGE_BROKERS,
        payload: broker,
      };
      expect(actions.changeBrokers(broker)).toEqual(expected);
    });
  });

  describe('changeClients', () => {
    it('has a type of CHANGE_CLIENTS', () => {
      const client = { name: '123' };
      const expected = {
        type: types.CHANGE_CLIENTS,
        payload: client,
      };
      expect(actions.changeClients(client)).toEqual(expected);
    });
  });

  describe('getCarrier', () => {
    it('has a type of LOAD_CARRIERS', () => {
      const expected = {
        type: types.LOAD_CARRIERS,
      };
      expect(actions.getCarrier()).toEqual(expected);
    });
  });

  describe('getBrokers', () => {
    it('has a type of LOAD_BROKERS', () => {
      const expected = {
        type: types.LOAD_BROKERS,
      };
      expect(actions.getBrokers()).toEqual(expected);
    });
  });

  describe('getClients', () => {
    it('has a type of LOAD_CLIENTS', () => {
      const expected = {
        type: types.LOAD_CLIENTS,
      };
      expect(actions.getClients()).toEqual(expected);
    });
  });

  describe('setRouteError', () => {
    it('has a type of SET_ROUTE_ERROR', () => {
      const error = '123';
      const expected = {
        type: types.SET_ROUTE_ERROR,
        payload: { error },
      };
      expect(actions.setRouteError(error)).toEqual(expected);
    });
  });

  describe('updateClient', () => {
    it('has a type of UPDATE_CLIENT', () => {
      const key = '123';
      const value = '234';
      const expected = {
        type: types.UPDATE_CLIENT,
        payload: { key, value },
      };
      expect(actions.updateClient(key, value)).toEqual(expected);
    });
  });

  describe('getClientsByName', () => {
    it('has a type of GET_CLIENTS_BY_NAME', () => {
      const searchText = 'Test';
      const expected = {
        type: types.GET_CLIENTS_BY_NAME,
        payload: { searchText },
      };
      expect(actions.getClientsByName(searchText)).toEqual(expected);
    });
  });

  describe('updateClientNameSearchText', () => {
    it('has a type of UPDATE_CLIENT_NAME_SEARCH_TEXT', () => {
      const text = 'Test';
      const expected = {
        type: types.UPDATE_CLIENT_NAME_SEARCH_TEXT,
        payload: { text },
      };
      expect(actions.updateClientNameSearchText(text)).toEqual(expected);
    });
  });
});

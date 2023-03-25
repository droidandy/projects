
import * as actions from '../CarrierSelect/actions';
import * as types from '../CarrierSelect/constants';

describe('CarrierSelect actions', () => {
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
      const broker = '123';
      const expected = {
        type: types.CHANGE_BROKERS,
        payload: broker,
      };
      expect(actions.changeBrokers(broker)).toEqual(expected);
    });
  });
  describe('changeClients', () => {
    it('has a type of CHANGE_CLIENTS', () => {
      const client = '123';
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
      const brokerId = '123';
      const expected = {
        type: types.LOAD_CLIENTS,
        payload: brokerId,
      };
      expect(actions.getClients(brokerId)).toEqual(expected);
    });
  });
});

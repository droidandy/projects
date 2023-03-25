import { browserHistory } from 'react-router';
import configureStore from '../../../store';
import {
  adminBroker,
  makeSelectCarrierEmailList,
} from '../selectors';

describe('Admin selectors', () => {
  let store;
  let state;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
    state = store.getState();
  });
  describe('makeSelectCarrierEmailList', () => {
    it('returns adminBroker', () => {
      expect(adminBroker(state)).toEqual(state.get('adminBroker'));
    });
  });
  describe('makeSelectCurrentUser', () => {
    it('returns function', () => {
      expect(typeof makeSelectCarrierEmailList()).toEqual('function');
    });
  });
});

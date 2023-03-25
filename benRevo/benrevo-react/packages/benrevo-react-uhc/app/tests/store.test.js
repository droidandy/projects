/**
 * Test store addons
 */

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { BENREVO_PATH } from '@benrevo/benrevo-react-core';
import configureStore from '../store';

describe('configureStore', () => {
  const browserHistory = useRouterHistory(createHistory)({
    basename: BENREVO_PATH,
  });
  const initialState = {};
  let store;

  beforeAll(() => {
    store = configureStore(initialState, browserHistory, {}, true);
  });

  describe('asyncReducers', () => {
    it('should contain an object for async reducers', () => {
      expect(typeof store.asyncReducers).toBe('object');
    });
  });

  describe('runSaga', () => {
    it('should contain a hook for `sagaMiddleware.run`', () => {
      expect(typeof store.runSaga).toBe('function');
    });
  });
});

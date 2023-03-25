import { browserHistory } from 'react-router';
import configureStore from '../../../store';
import {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocationState,
} from '../selectors';

describe('App selectors', () => {
  let store;
  let state;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
    state = store.getState().get('clearValuePage');
  });

  describe('selectGlobal', () => {
    it('returns app', () => {
      expect(selectGlobal(state)).toEqual(state.get('app'));
    });
  });

  describe('makeSelectCurrentUser', () => {
    it('returns function', () => {
      expect(typeof makeSelectCurrentUser()).toEqual('function');
    });
  });

  describe('makeSelectLoading', () => {
    it('returns function', () => {
      expect(typeof makeSelectLoading()).toEqual('function');
    });
  });

  describe('makeSelectError', () => {
    it('returns function', () => {
      expect(typeof makeSelectError()).toEqual('function');
    });
  });

  describe('makeSelectRepos', () => {
    it('returns function', () => {
      expect(typeof makeSelectRepos()).toEqual('function');
    });
  });

  describe('makeSelectLocationState', () => {
    it('returns function', () => {
      expect(typeof makeSelectLocationState()).toEqual('function');
    });
  });
});

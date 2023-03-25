import { browserHistory } from 'react-router';
import { fromJS } from 'immutable';
import configureStore from '../../../../store';
import reducer from '../reducer';
import * as actions from '../actions';
import * as types from '../constants';

describe('ClearValueReducer', () => {
  let store;
  let state;

  beforeAll(() => {
    store = configureStore({}, browserHistory);
    state = store.getState().get('clearValuePage');
  });

  it('CHANGE_LOAD', () => {
    const key = 0;
    const value = '123';
    const action = actions.changeClearValue(key, value);
    const mockState = state
      .set(key, '123');
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CLEAR_VALUE_CALCULATE', () => {
    const action = actions.clearValueCalculate();
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CLEAR_VALUE_CALCULATE_SUCCESS', () => {
    const result = {};
    const action = { type: types.CLEAR_VALUE_CALCULATE_SUCCESS, payload: result };
    const mockState = state
      .set('error', false)
      .set('loading', false)
      .set('calculated', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CLEAR_VALUE_CALCULATE_ERROR', () => {
    const action = { type: types.CLEAR_VALUE_CALCULATE_ERROR };
    const mockState = state
      .set('calculated', fromJS({}))
      .set('error', true)
      .set('loading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';

describe('AdminReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      carrierEmailList: [],
      loading: false,
    });
  });

  it('initial state', () => {
    const action = { type: undefined };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('GET_CARRIER_EMAILS', () => {
    const action = { type: types.GET_CARRIER_EMAILS };
    const mockState = state
      .set('loading', true)
      .set('carrierEmailList', fromJS([]));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CARRIER_EMAILS_SUCCESS', () => {
    const action = { type: types.GET_CARRIER_EMAILS_SUCCESS, payload: [] };
    const configData = action.payload;
    const carrierEmailList = (configData && configData.length) ? JSON.parse(configData[0].data) : [];
    const mockState = state
      .set('loading', false)
      .set('carrierEmailList', fromJS(carrierEmailList));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_APPROVE_CARRIER', () => {
    const action = { type: types.CHANGE_APPROVE_CARRIER, payload: { carrierIndex: 1, value: true } };
    const carrierEmailList = [];
    const mockState = state
      .set('carrierEmailList', fromJS(carrierEmailList));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('DELETE_EMAIL_FROM_CARRIER', () => {
    const action = { type: types.DELETE_EMAIL_FROM_CARRIER, payload: [] };
    const carrierEmailList = [];
    const mockState = state
      .set('loading', true)
      .set('carrierEmailList', fromJS(carrierEmailList));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SAVE_EMAILS', () => {
    const action = { type: types.SAVE_EMAILS, payload: [] };
    const carrierEmailList = [];
    const mockState = state
      .set('loading', true)
      .set('carrierEmailList', fromJS(carrierEmailList));
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';

describe('carrierReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      gaClients: [],
      loadingDataAccessPage: false,
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('GA_CLIENTS_GET', () => {
    const mockAction = { type: types.GA_CLIENTS_GET };
    const mockState = state
      .setIn(['gaClients'], fromJS([]))
      .setIn(['loadingDataAccessPage'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GA_CLIENTS_GET_SUCCESS', () => {
    const mockAction = { type: types.GA_CLIENTS_GET_SUCCESS, payload: { data: 1 } };
    const mockState = state
      .setIn(['gaClients'], fromJS(mockAction.payload))
      .setIn(['loadingDataAccessPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GA_CLIENTS_GET_ERROR', () => {
    const mockAction = { type: types.GA_CLIENTS_GET_ERROR };
    const mockState = state
      .setIn(['gaClients'], fromJS([]))
      .setIn(['loadingDataAccessPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_ACCESS_TO_CLIENT_SUCCESS', () => {
    const mockAction = { type: types.REMOVE_ACCESS_TO_CLIENT_SUCCESS };
    const mockState = state
      .setIn(['gaClients'], fromJS([]))
      .setIn(['loadingDataAccessPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_ACCESS_TO_CLIENT_ERROR', () => {
    const mockAction = { type: types.REMOVE_ACCESS_TO_CLIENT_ERROR };
    const mockState = state
      .setIn(['gaClients'], fromJS([]))
      .setIn(['loadingDataAccessPage'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});


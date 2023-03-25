import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';
import * as planTypes from '../../Plans/constants';

describe('Client reducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
      error: false,
      carriers: [],
      brokers: [],
      clients: [],
      selectedCarrier: {},
      selectedBroker: {},
      selectedClient: {},
      currentBroker: {},
      selectError: false,
      clientNameSearchText: '',
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_CARRIERS', () => {
    const selected = fromJS({});

    const mockAction = { type: types.CHANGE_CARRIERS, payload: 'test' };
    const mockState = state
      .set('selectedCarrier', selected);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_BROKERS', () => {
    const selected = fromJS({});

    const mockAction = { type: types.CHANGE_BROKERS, payload: 'test' };
    const mockState = state
      .set('selectedBroker', selected);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CLIENTS', () => {
    const mockAction = { type: types.CHANGE_CLIENTS, payload: { brokerId: 0 } };
    const brokers = state.get('brokers');
    let selected = fromJS({});
    brokers.map((item) => {
      if (item.get('id') === mockAction.payload.brokerId) {
        selected = item;
        return true;
      }
      return true;
    });
    const mockState = state
      .set('currentBroker', selected)
      .set('selectedClient', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_CLIENT', () => {
    const mockAction = { type: types.UPDATE_CLIENT, payload: { key: 1, value: 'test' } };
    const mockState = state
      .setIn(['selectedClient', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_CARRIERS_SUCCESS', () => {
    const mockAction = { type: types.LOAD_CARRIERS_SUCCESS, payload: [] };
    const mockState = state
      .set('selectedCarrier', fromJS(null))
      .set('carriers', fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_BROKERS_SUCCESS', () => {
    const mockAction = { type: types.LOAD_BROKERS_SUCCESS, payload: 'test' };
    const mockState = state
      .set('brokers', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_CLIENTS', () => {
    const mockAction = { type: types.LOAD_CLIENTS, payload: 'test' };
    const mockState = state
      .set('clients', fromJS([]))
      .set('currentBroker', state.get('selectedBroker'))
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_CLIENTS_SUCCESS', () => {
    const mockAction = { type: types.LOAD_CLIENTS_SUCCESS, payload: 'test' };
    const mockState = state
      .set('loading', false)
      .set('clients', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_CLIENTS_ERROR', () => {
    const mockAction = { type: types.LOAD_CLIENTS_ERROR };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SET_ROUTE_ERROR', () => {
    const mockAction = { type: types.SET_ROUTE_ERROR, payload: { error: 'test' } };
    const mockState = state
      .set('selectError', mockAction.payload.error);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_CLIENT', () => {
    const mockAction = { type: planTypes.CHANGE_SELECTED_CLIENT, payload: { path: 'path', value: 'test2' } };
    const mockState = state
      .setIn(['selectedClient', mockAction.payload.path], mockAction.payload.value)
      .setIn(['selectedClient', 'hasChangedClientData'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CLIENTS_BY_NAME', () => {
    const mockAction = { type: types.GET_CLIENTS_BY_NAME, payload: { searchText: 'test' } };
    const mockState = state
      .set('clients', fromJS([]))
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_CLIENT_NAME_SEARCH_TEXT', () => {
    const mockAction = { type: types.UPDATE_CLIENT_NAME_SEARCH_TEXT, payload: { text: 'test' } };
    const mockState = state
      .setIn(['clientNameSearchText'], mockAction.payload.text);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});

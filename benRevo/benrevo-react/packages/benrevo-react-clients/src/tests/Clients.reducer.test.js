import { Map, fromJS } from 'immutable';
import reducer, { sortClient, initialState as clientsReducerState } from '../reducer';
import { saveNewClient, quoteNewClient, clientsSort, setRouteError, selectClient } from '../actions';
import clientsJSON from './_v1_clients.json';

import {
  FETCH_CLIENT_SUCCEEDED,
  SAVE_CLIENT_SUCCEEDED,
  SAVE_CLIENT_FAILED,
  FETCH_CLIENTS_FAILED,
  IMPORT_CLIENT,
  IMPORT_CLIENT_SUCCEEDED,
  IMPORT_CLIENT_FAILED,
} from '../constants';

describe('clientPageReducer', () => {
  let clients;
  beforeAll(() => {
    clients = clientsReducerState;
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(clients);
  });

  it('SAVE_CLIENT_SUCCEEDED', () => {
    const products = fromJS({
      medical: true,
      dental: true,
      vision: true,
      life: false,
      std: false,
      ltd: false,
    });
    const virginCoverage = fromJS({
      medical: false,
      dental: false,
      vision: false,
      life: false,
      std: false,
      ltd: false,
    });

    const mockAction = { type: SAVE_CLIENT_SUCCEEDED, payload: { id: 1, clientState: '' } };
    const mockState = clients.set('current', fromJS({ ...mockAction.payload, products, virginCoverage, attributes: [] })).set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FETCH_CLIENT_SUCCEEDED', () => {
    const products = fromJS({
      medical: true,
      dental: true,
      vision: true,
      life: false,
      std: false,
      ltd: false,
    });
    const virginCoverage = fromJS({
      medical: false,
      dental: false,
      vision: false,
      life: false,
      std: false,
      ltd: false,
    });

    const mockAction = { type: FETCH_CLIENT_SUCCEEDED, payload: { id: 1, clientState: '' } };
    const mockState = clients.set('current', fromJS({ ...mockAction.payload, products, virginCoverage, attributes: [] })).set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CLIENT_FAILED', () => {
    const mockAction = { type: SAVE_CLIENT_FAILED };
    const mockState = clients.set('clientSaveFailed', true).set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SAVE_CLIENT', () => {
    const mockAction = saveNewClient();
    const mockState = clients.set('clientSaveInProgress', true).set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('QUOTE_NEW_CLIENT', () => {
    const mockAction = quoteNewClient();
    const mockState = clients.set('currentChanged', true).set('loading', false).setIn(['current', 'isNew'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  describe('SELECT_CLIENT', () => {
    it('empty', () => {
      const mockAction = selectClient();
      const mockState = clients.set('loading', false).setIn(['current', 'isNew'], true);
      expect(reducer(undefined, mockAction)).toEqual(mockState);
    });
  });

  describe('CLIENTS_SORT', () => {
    it('exists prop descending', () => {
      const mockAction = clientsSort('id', 'descending');
      const mockState = clients.setIn(['sort', 'prop'], 'id').setIn(['sort', 'order'], 'descending');
      expect(reducer(undefined, mockAction)).toEqual(mockState);
    });

    it('exists prop ascending', () => {
      const mockAction = clientsSort('id');
      const mockState = clients.setIn(['sort', 'prop'], 'id').setIn(['sort', 'order'], 'descending');
      expect(reducer(undefined, mockAction)).toEqual(mockState);
    });

    it('new prop', () => {
      const mockAction = clientsSort('name');
      const mockState = clients.setIn(['sort', 'prop'], 'name').setIn(['sort', 'order'], 'ascending');
      expect(reducer(undefined, mockAction)).toEqual(mockState);
    });

    it('sort descending', () => {
      const sortClients = sortClient([clientsJSON[1], clientsJSON[0]], Map({ order: 'clientName', sort: 'descending' }));
      const mockClients = fromJS([clientsJSON[1], clientsJSON[0]]);

      expect(sortClients).toEqual(mockClients);
    });
  });

  it('FETCH_CLIENTS_FAILED', () => {
    const mockAction = { type: FETCH_CLIENTS_FAILED };
    const mockState = clients.set('clientsLoadingError', true).set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SET_RFP_ROUTING_STATUS', () => {
    const mockAction = setRouteError(true, 'rfp');
    const mockState = clients.set('rfpRouteFailed', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('IMPORT_CLIENT', () => {
    const mockAction = { type: IMPORT_CLIENT };
    const mockState = clients
      .set('importLoading', true)
      .set('clientOverride', Map({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('IMPORT_CLIENT_SUCCEEDED 1', () => {
    const mockAction = { type: IMPORT_CLIENT_SUCCEEDED, payload: { data: 1 } };
    const mockState = clients
      .set('importLoading', false)
      .set('clientOverride', Map(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('IMPORT_CLIENT_SUCCEEDED 2', () => {
    const mockAction = { type: IMPORT_CLIENT_SUCCEEDED, payload: { id: 1 } };
    const mockState = clients
      .set('importLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('IMPORT_CLIENT_FAILED', () => {
    const mockAction = { type: IMPORT_CLIENT_FAILED };
    const mockState = clients
      .set('clientOverride', Map({}))
      .set('importLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});

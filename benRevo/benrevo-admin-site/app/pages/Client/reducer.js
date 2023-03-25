import { fromJS } from 'immutable';

import * as types from './constants';
import * as planTypes from '../Plans/constants';
import { CARRIER, selectedCarrier } from '../../config';

// The initial state of the App
const initialState = fromJS({
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

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_CARRIERS: {
      const carriers = state.get('carriers');
      let selected = fromJS({});

      carriers.map((item) => {
        if (item.get('carrierId') === action.payload) {
          selected = item;
          return true;
        }

        return true;
      });
      selectedCarrier.value = selected.get('name');

      return state
        .set('selectedCarrier', selected);
    }
    case types.CHANGE_BROKERS: {
      const brokers = state.get('brokers');
      let selected = fromJS({});

      brokers.map((item) => {
        if (item.get('id') === action.payload) {
          selected = item;
          return true;
        }

        return true;
      });

      return state
        .set('selectedBroker', selected);
    }
    case types.CHANGE_CLIENTS: {
      const brokers = state.get('brokers');
      let selected = fromJS({});

      brokers.map((item) => {
        if (item.get('id') === action.payload.brokerId) {
          selected = item;
          return true;
        }

        return true;
      });

      return state
        .set('currentBroker', selected)
        .set('selectedClient', fromJS(action.payload));
    }
    case types.UPDATE_CLIENT:
      return state
      .setIn(['selectedClient', action.payload.key], action.payload.value);
    case types.LOAD_CARRIERS_SUCCESS: {
      const carriers = [];
      let selected = null;
      action.payload.map((item) => {
        if (
          (item.name === 'UHC' && CARRIER === 'UHC') ||
          (item.name === 'ANTHEM_BLUE_CROSS' && CARRIER === 'ANTHEM') ||
          (item.name === 'UHC' && CARRIER === 'BENREVO') ||
          (item.name === 'ANTHEM_BLUE_CROSS' && CARRIER === 'BENREVO')
        ) {
          if (CARRIER !== 'BENREVO') selected = item;
          else if (CARRIER === 'BENREVO' && !selected) selected = item;
          carriers.push(item);
        }

        return true;
      });
      selectedCarrier.value = selected ? selected.name : null;

      return state
        .set('selectedCarrier', fromJS(selected))
        .set('carriers', fromJS(carriers));
    }
    case types.LOAD_BROKERS_SUCCESS:
      return state
      .set('brokers', fromJS(action.payload));
    case types.LOAD_CLIENTS:
      return state
      .set('clients', fromJS([]))
      .set('currentBroker', state.get('selectedBroker'))
      .set('loading', true);
    case types.LOAD_CLIENTS_SUCCESS:
      return state
        .set('loading', false)
        .set('clients', fromJS(action.payload));
    case types.LOAD_CLIENTS_ERROR:
      return state
        .set('loading', false);
    case types.SET_ROUTE_ERROR:
      return state
        .set('selectError', action.payload.error);
    case types.CHANGE_CURRENT_BROKER:
      return state
        .set('currentBroker', fromJS(action.payload.broker))
        .set('selectedBroker', fromJS(action.payload.broker))
        .set('clients', fromJS([]));
    case types.CHANGE_CURRENT_MEMBERS:
      return state
        .setIn(['selectedClient', 'clientMembers'], action.payload.members);
    case planTypes.CHANGE_SELECTED_CLIENT:
      return state
        .setIn(['selectedClient', action.payload.path], action.payload.value)
        .setIn(['selectedClient', 'hasChangedClientData'], true);
    case types.GET_CLIENTS_BY_NAME:
      return state
        .set('clients', fromJS([]))
        .set('loading', true);
    case types.UPDATE_CLIENT_NAME_SEARCH_TEXT:
      return state
        .setIn(['clientNameSearchText'], action.payload.text);
    default:
      return state;
  }
}

export default appReducer;

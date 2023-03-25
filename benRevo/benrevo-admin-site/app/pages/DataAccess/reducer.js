import { fromJS } from 'immutable';
import * as types from './constants';

const initialState = fromJS({
  gaClients: [],
  loadingDataAccessPage: false,
});

function DataAccessReducer(state = initialState, action) {
  switch (action.type) {
    case types.GA_CLIENTS_GET: {
      return state
        .setIn(['gaClients'], fromJS([]))
        .setIn(['loadingDataAccessPage'], true);
    }
    case types.GA_CLIENTS_GET_SUCCESS: {
      return state
        .setIn(['gaClients'], fromJS(action.payload))
        .setIn(['loadingDataAccessPage'], false);
    }
    case types.GA_CLIENTS_GET_ERROR: {
      return state
        .setIn(['gaClients'], fromJS([]))
        .setIn(['loadingDataAccessPage'], false);
    }
    case types.REMOVE_ACCESS_TO_CLIENT_SUCCESS: {
      return state
        .setIn(['gaClients'], fromJS([]))
        .setIn(['loadingDataAccessPage'], false);
    }
    case types.REMOVE_ACCESS_TO_CLIENT_ERROR: {
      return state
        .setIn(['gaClients'], fromJS([]))
        .setIn(['loadingDataAccessPage'], false);
    }
    default:
      return state;
  }
}

export default DataAccessReducer;

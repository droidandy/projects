import { fromJS } from 'immutable';
import * as types from './constants';

const initialState = fromJS({
  loading: false,
  peopleLoading: false,
  listType: '',
  changedBrokerage: {},
  selectedBroker: {},
  auth0List: [],
});

function BrokerageReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_BROKERAGE: {
      return state
        .setIn(['changedBrokerage', 'id'], action.payload.id)
        .setIn(['changedBrokerage', action.payload.key], action.payload.value);
    }
    case types.SELECT_BROKER: {
      return state
        .set('changedBrokerage', fromJS({}))
        .set('selectedBroker', fromJS(action.payload));
    }
    case types.REVERT_CHANGES: {
      return state
        .set('changedBrokerage', fromJS({}));
    }
    case types.SAVE_CHANGES: {
      return state
        .set('loading', true);
    }
    case types.SAVE_CHANGES_SUCCESS: {
      return state
        .set('loading', false)
        .set('changedBrokerage', fromJS({}))
        .set('selectedBroker', fromJS(action.payload));
    }
    case types.SAVE_CHANGES_ERROR: {
      return state
        .set('loading', false);
    }
    case types.SET_LIST_TYPE: {
      return state
        .set('listType', action.payload);
    }
    case types.GET_AUTH0_LIST: {
      return state
        .set('peopleLoading', true);
    }
    case types.GET_AUTH0_LIST_SUCCESS: {
      return state
        .set('peopleLoading', false)
        .set('auth0List', fromJS(action.payload));
    }
    case types.GET_AUTH0_LIST_ERROR: {
      return state
        .set('peopleLoading', false);
    }
    default:
      return state;
  }
}

export default BrokerageReducer;

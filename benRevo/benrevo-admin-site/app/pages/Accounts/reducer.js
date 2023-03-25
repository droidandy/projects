import { fromJS } from 'immutable';
import * as types from './constants';

const accountsState = fromJS({
  loading: false,
  routeError: false,
  requests: [],
  ga: [],
  brokerages: [],
  presales: [],
  sales: [],
  currentOriginal: {},
  current: {},
  isExistingGA: false,
  isExistingBrokerage: false,
  selectedGA: null,
  selectedBrokerage: null,
  denyReason: '',
  bccEmail: '',
});

function AccountsReducer(state = accountsState, action) {
  switch (action.type) {
    case types.CHANGE_FIELD: {
      return state
        .setIn([action.payload.key], action.payload.value);
    }
    case types.REQUESTS_GET: {
      return state
        .setIn(['requests'], fromJS([]))
        .setIn(['loading'], true);
    }
    case types.REQUESTS_GET_SUCCESS: {
      return state
        .setIn(['loading'], false)
        .setIn(['requests'], fromJS(action.payload.reverse()));
    }
    case types.REQUESTS_GET_ERROR: {
      return state
        .setIn(['loading'], false);
    }

    case types.GA_GET: {
      return state
        .setIn(['ga'], fromJS([]));
    }
    case types.GA_GETS_SUCCESS: {
      return state
        .setIn(['ga'], fromJS(action.payload));
    }

    case types.CONTACTS_GET: {
      return state
        .setIn(['presales'], fromJS([]))
        .setIn(['sales'], fromJS([]));
    }
    case types.CONTACTS_GET_SUCCESS: {
      return state
        .setIn(['presales'], fromJS(action.payload.presales))
        .setIn(['sales'], fromJS(action.payload.sales));
    }

    case types.BROKERAGE_GET: {
      return state
        .setIn(['brokerages'], fromJS([]));
    }
    case types.BROKERAGE_GETS_SUCCESS: {
      return state
        .setIn(['brokerages'], fromJS(action.payload));
    }

    case types.SELECT_REQUEST: {
      const item = action.payload;
      let selectedBrokerage = null;
      let selectedGA = null;
      let isExistingGA = false;
      let isExistingBrokerage = false;

      if (item.brokerId) {
        selectedBrokerage = item.brokerId;
        isExistingBrokerage = true;
      }

      if (item.gaId) {
        selectedGA = item.gaId;
        isExistingGA = true;
      }


      return state
        .setIn(['denyReason'], '')
        .setIn(['isExistingGA'], isExistingGA)
        .setIn(['isExistingBrokerage'], isExistingBrokerage)
        .setIn(['selectedGA'], selectedGA)
        .setIn(['selectedBrokerage'], selectedBrokerage)
        .setIn(['currentOriginal'], fromJS(action.payload))
        .setIn(['current'], fromJS(action.payload))
        .setIn(['bccEmail'], action.payload.bcc || '');
    }
    case types.CHANGE_INFO: {
      return state
        .setIn(['current', action.payload.key], action.payload.value);
    }
    case types.CANCEL_CHANGE_INFO: {
      return state
        .setIn(['current'], state.get('currentOriginal'));
    }
    case types.SAVE_INFO: {
      return state
        .setIn(['currentOriginal'], state.get('current'));
    }
    case types.APPROVE: {
      return state
        .setIn(['loading'], true);
    }
    case types.APPROVE_SUCCESS: {
      return state
        .setIn(['loading'], false);
    }
    case types.APPROVE_ERROR: {
      return state
        .setIn(['loading'], false);
    }
    case types.SET_ERROR: {
      return state
        .setIn(['routeError'], action.payload);
    }
    case types.UPDATE_BCC: {
      return state
        .setIn(['bccEmail'], action.payload);
    }
    default:
      return state;
  }
}

export default AccountsReducer;

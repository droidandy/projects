/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS, Map } from 'immutable';
import { CARRIERS_GET_SUCCESS } from '@benrevo/benrevo-react-quote';
import * as types from './constants';
import { CARRIER } from '../../config';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  carriersLoaded: false,
  error: false,
  currentUser: false,
  showMobileNav: false,
  checkingRole: true,
  carriers: {
    medical: [],
    dental: [],
    vision: [],
  },
  sae: [],
  brokers: [],
  mainCarrier: {},
  rfpcarriers: {
    medical: [],
    dental: [],
    vision: [],
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.TOGGLE_MOBILE_NAV:
      return state
      .set('showMobileNav', !state.get('showMobileNav'));
    case types.CHECKING_ROLE:
      return state
      .set('checkingRole', action.payload);
    case types.CARRIERS_GET: {
      return state
        .set('carriersLoaded', false);
    }
    case types.CARRIERS_GET_SUCCESS: {
      let mainCarrier = {};

      action.payload.medical.sort(
        (a, b) => {
          const x = a.displayName;
          const y = b.displayName;
          if (x < y) return -1;
          else if (x > y) return 1;
          return 0;
        }
      );

      action.payload.dental.sort(
        (a, b) => {
          const x = a.displayName;
          const y = b.displayName;
          if (x < y) return -1;
          else if (x > y) return 1;
          return 0;
        }
      );

      action.payload.vision.sort(
        (a, b) => {
          const x = a.displayName;
          const y = b.displayName;
          if (x < y) return -1;
          else if (x > y) return 1;
          return 0;
        }
      );

      action.payload.medical.map((item) => {
        if (CARRIER === 'ANTHEM' && item.name === 'ANTHEM_BLUE_CROSS') {
          mainCarrier = Map(item);
        } else if (CARRIER === 'UHC' && item.name === 'UHC') {
          mainCarrier = Map(item);
        }

        return true;
      });

      return state
        .setIn(['mainCarrier'], mainCarrier)
        .set('carriersLoaded', true)
        .set('carriers', fromJS(action.payload));
    }
    case types.PERSONS_GET_SUCCESS: {
      action.payload.sort(
        (a, b) => {
          const x = a.fullName;
          const y = b.fullName;
          if (x < y) {
            return -1;
          } else if (x > y) {
            return 1;
          }
          return 0;
        }
      );
      return state
        .set('sae', fromJS(action.payload));
    }
    case types.BROKERS_GET_SUCCESS: {
      action.payload.sort(
        (a, b) => {
          const x = (a.name) ? a.name.toLowerCase() : '';
          const y = (b.name) ? b.name.toLowerCase() : '';
          if (x < y) {
            return -1;
          } else if (x > y) {
            return 1;
          }
          return 0;
        }
      );

      return state
        .set('brokers', fromJS(action.payload));
    }
    case CARRIERS_GET_SUCCESS: {
      return state
        .setIn(['rfpcarriers', action.meta.section], fromJS(action.payload));
    }
    default:
      return state;
  }
}

export default appReducer;

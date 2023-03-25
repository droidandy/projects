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

import { fromJS } from 'immutable';

import * as types from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  showMobileNav: false,
  checkingRole: true,
  rfpcarriers: {
    medical: [],
    dental: [],
    vision: [],
    life: [],
    std: [],
    ltd: [],
    vol_life: [],
    vol_std: [],
    vol_ltd: [],
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
    case types.GET_ALL_CARRIERS:
      return state
        .set('error', false)
        .set('loading', true);
    case types.GET_ALL_CARRIERS_SUCCESS:
      return state
        .set('loading', false)
        .setIn(['rfpcarriers', action.meta.section], fromJS(action.payload));
    case types.GET_ALL_CARRIERS_ERROR:
      return state
        .set('error', true);
    default:
      return state;
  }
}

export default appReducer;

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
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.TOGGLE_MOBILE_NAV:
      return state
      .set('showMobileNav', !state.get('showMobileNav'));
    case types.CHECKING_ROLE:
      return state
      .set('checkingRole', action.payload);
    default:
      return state;
  }
}

export default appReducer;

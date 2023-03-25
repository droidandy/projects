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
  requestDemoSent: false,
  requestDemoForm: {
    name: '',
    phoneNumber: '',
    companyName: '',
    email: '',
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.TOGGLE_MOBILE_NAV:
      return state
      .set('showMobileNav', !state.get('showMobileNav'));
    case types.CHANGE_FORM:
      return state
        .setIn(['requestDemoForm', action.payload.key], action.payload.value);
    case types.FORM_SUBMIT:
      return state
        .setIn(['loading'], true);
    case types.FORM_SUBMIT_SUCCESS:
      return state
        .setIn(['loading'], false)
        .setIn(['requestDemoSent'], true);
    case types.FORM_SUBMIT_ERROR:
      return state
        .setIn(['loading'], false);
    default:
      return state;
  }
}

export default appReducer;

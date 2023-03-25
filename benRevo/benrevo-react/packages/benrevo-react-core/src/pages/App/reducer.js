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

import {
  TOGGLE_MOBILE_NAV,
  CHECKING_ROLE,
  OPEN_FEEDBACK_MODAL,
  CLOSE_FEEDBACK_MODAL,
} from './constants';

import {
  SEND_FEEDBACK,
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_SUCCESS,
} from './../../utils/authService/constants';

// The initial state of the App
export const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  showMobileNav: false,
  checkingRole: true,
  feedbackModalOpen: false,
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_MOBILE_NAV:
      return state
      .set('showMobileNav', !state.get('showMobileNav'));
    case CHECKING_ROLE:
      return state
        .set('checkingRole', action.payload);
    case SEND_FEEDBACK:
      return state
        .set('loading', true);
    case SEND_FEEDBACK_ERROR:
      return state
        .set('loading', false);
    case SEND_FEEDBACK_SUCCESS:
      return state
        .set('loading', false);
    case OPEN_FEEDBACK_MODAL: {
      return state
        .set('feedbackModalOpen', true);
    }
    case CLOSE_FEEDBACK_MODAL: {
      return state
        .set('feedbackModalOpen', false);
    }
    default:
      return state;
  }
}

export default appReducer;

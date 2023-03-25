/*
 * HomeReducer
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
  CHANGE_FORM,
  FORM_SUBMIT,
  FORM_SUBMIT_SUCCESS,
  FORM_SUBMIT_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  sent: false,
  loading: false,
  form: {
    firstName: '',
    lastName: '',
    brokerageFirmName: '',
    brokerageFirmZipCode: '',
    email: '',
  },
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return state
        .setIn(['form', action.payload.key], action.payload.value);
    case FORM_SUBMIT:
      return state
        .setIn(['loading'], true);
    case FORM_SUBMIT_SUCCESS:
      return state
        .setIn(['loading'], false)
        .setIn(['form'], initialState.get('form'))
        .setIn(['sent'], true);
    case FORM_SUBMIT_ERROR:
      return state
        .setIn(['loading'], false);
    default:
      return state;
  }
}

export default homeReducer;

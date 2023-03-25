/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import * as types from './constants';

export function toggleMobileNav() {
  return {
    type: types.TOGGLE_MOBILE_NAV,
  };
}

export function changeForm(key, value) {
  return {
    type: types.CHANGE_FORM,
    payload: { key, value },
  };
}

export function formSubmit() {
  return {
    type: types.FORM_SUBMIT,
  };
}


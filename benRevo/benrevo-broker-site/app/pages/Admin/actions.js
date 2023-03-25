/*
 * Admin Actions
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

export function getCarrierEmailsList() {
  return {
    type: types.GET_CARRIER_EMAILS,
  };
}

export function changeApproveCarrier(value, carrierIndex) {
  return {
    type: types.CHANGE_APPROVE_CARRIER,
    payload: { value, carrierIndex },
  };
}

export function deleteEmailFromCarrier(carrierIndex, emailIndex) {
  return {
    type: types.DELETE_EMAIL_FROM_CARRIER,
    payload: { carrierIndex, emailIndex },
  };
}

export function saveEmails(carrierIndex, emails) {
  return {
    type: types.SAVE_EMAILS,
    payload: { carrierIndex, emails },
  };
}

export function saveCarrierEmailList() {
  return {
    type: types.UPDATE_CARRIER_EMAILS,
  };
}


/*
 *
 * Accounts actions
 *
 */

import * as types from './constants';

export function requestsGet() {
  return {
    type: types.REQUESTS_GET,
  };
}

export function gaGets() {
  return {
    type: types.GA_GET,
  };
}

export function contactsGets() {
  return {
    type: types.CONTACTS_GET,
  };
}

export function brokerageGets() {
  return {
    type: types.BROKERAGE_GET,
  };
}

export function selectRequest(request) {
  return {
    type: types.SELECT_REQUEST,
    payload: request,
  };
}

export function setRouteError(status) {
  return {
    type: types.SET_ERROR,
    payload: status,
  };
}

export function changeField(key, value) {
  return {
    type: types.CHANGE_FIELD,
    payload: { key, value },
  };
}

export function changeInfo(key, value) {
  return {
    type: types.CHANGE_INFO,
    payload: { key, value },
  };
}

export function saveInfo() {
  return {
    type: types.SAVE_INFO,
  };
}

export function cancelChangeInfo() {
  return {
    type: types.CANCEL_CHANGE_INFO,
  };
}

export function approve() {
  return {
    type: types.APPROVE,
  };
}

export function decline() {
  return {
    type: types.DECLINE,
  };
}

export function updateBCC(text) {
  return {
    type: types.UPDATE_BCC,
    payload: text,
  };
}

export function toggleCheck() {
  return {
    type: types.TOGGLE_CHECK,
  };
}

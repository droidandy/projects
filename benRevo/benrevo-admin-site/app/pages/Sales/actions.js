/*
 *
 * Sales actions
 *
*/

import * as types from './constants';

export function getPersons() {
  return {
    type: types.PERSONS_GET,
  };
}

export function savePersons() {
  return {
    type: types.PERSONS_SAVE,
  };
}

export function saveNewPersons() {
  return {
    type: types.PERSONS_SAVE_NEW,
  };
}

export function fetchBrokerages() {
  return {
    type: types.BROKERAGE_GET,
  };
}

export function changeBrokerage(brokerage) {
  return {
    type: types.CHANGE_BROKERAGE,
    payload: brokerage,
  };
}

export function updateBrokerage(type, value) {
  return {
    type: types.UPDATE_BROKERAGE,
    payload: { type, value },
  };
}

export function saveBrokerage() {
  return {
    type: types.BROKERAGE_SAVE,
  };
}

export function updatePerson(key, value) {
  return {
    type: types.PERSON_UPDATE,
    payload: { key, value },
  };
}

export function cancelPerson() {
  return {
    type: types.PERSON_CANCEL,
  };
}

export function updateSearchText(value) {
  return {
    type: types.SEARCH_TEXT_UPDATE,
    payload: { value },
  };
}

export function removeNewPerson(index) {
  return {
    type: types.REMOVE_NEW_PERSON,
    payload: { index },
  };
}

export function addNewPerson() {
  return {
    type: types.ADD_NEW_PERSON,
  };
}

export function updateNewPerson(index, key, value, carrierId) {
  return {
    type: types.UPDATE_NEW_PERSON,
    payload: { index, key, value, carrierId },
  };
}

export function newPOI(person, action) {
  return {
    type: types.NEW_POI,
    payload: { person, action },
  };
}

export function updateChildren(index, value) {
  return {
    type: types.UPDATE_CHILDREN,
    payload: { index, value },
  };
}

export function removeChildren(index) {
  return {
    type: types.REMOVE_CHILDREN,
    payload: { index },
  };
}

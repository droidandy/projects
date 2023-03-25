import * as types from './constants';

export function updateBrokerage(id, key, value) {
  return {
    type: types.UPDATE_BROKERAGE,
    payload: { id, key, value },
  };
}

export function selectBroker(broker) {
  return {
    type: types.SELECT_BROKER,
    payload: broker,
  };
}

export function revertChanges() {
  return {
    type: types.REVERT_CHANGES,
  };
}

export function saveChanges() {
  return {
    type: types.SAVE_CHANGES,
  };
}

export function setListType(type) {
  return {
    type: types.SET_LIST_TYPE,
    payload: type,
  };
}

export function getAuth0(id) {
  return {
    type: types.GET_AUTH0_LIST,
    payload: id,
  };
}

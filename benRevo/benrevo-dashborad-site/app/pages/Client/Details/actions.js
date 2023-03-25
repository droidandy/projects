import * as types from './constants';

export function getClient(clientId, product = '', notClear) {
  return {
    type: types.CLIENT_GET,
    payload: { clientId, product, notClear },
  };
}

export function getActivities(clientId) {
  return {
    type: types.ACTIVITIES_GET,
    payload: { clientId },
  };
}

export function changeOptionsProduct(clientId, product) {
  return {
    type: types.CHANGE_OPTIONS_PRODUCT,
    payload: { clientId, product },
  };
}

export function changeActivitySort(prop, order) {
  return {
    type: types.CHANGE_ACTIVITY_SORT,
    payload: { prop, order },
  };
}

export function changeAccessStatus(status) {
  return {
    type: types.CHANGE_ACCESS_STATUS,
    payload: status,
  };
}

export function getOption(id) {
  return {
    type: types.OPTION_GET,
    payload: { id },
  };
}

export function getActivity(id) {
  return {
    type: types.ACTIVITY_GET,
    payload: { id },
  };
}

export function getActivityByType(type) {
  return {
    type: types.ACTIVITY_BY_TYPE_GET,
    payload: { type },
  };
}

export function changeActivity(key, value) {
  return {
    type: types.CHANGE_ACTIVITY,
    payload: { key, value },
  };
}

export function updateActivity(id) {
  return {
    type: types.ACTIVITY_UPDATE,
    payload: { id },
  };
}

export function createActivity() {
  return {
    type: types.ACTIVITY_CREATE,
  };
}

export function removeActivity(id) {
  return {
    type: types.ACTIVITY_REMOVE,
    payload: { id },
  };
}

export function toggleHistoryEditMode() {
  return {
    type: types.TOGGLE_HISTORY_EDIT_MODE,
  };
}

export function updateHistoryText(text) {
  return {
    type: types.UPDATE_HISTORY_TEXT,
    payload: text,
  };
}

export function saveHistoryUpdates() {
  return {
    type: types.SAVE_HISTORY_UPDATES,
  };
}

export function getHistoryNotes(clientId) {
  return {
    type: types.GET_HISTORY_NOTES,
    payload: clientId,
  };
}

import * as types from './constants';

export function initOptions(section) {
  return {
    meta: {
      section,
    },
    type: types.INIT_OPTIONS,
  };
}

export function getAnotherOptions(section) {
  return {
    meta: {
      section,
    },
    type: types.GET_ANOTHER_OPTIONS,
  };
}

export function getComparison() {
  return {
    meta: {},
    type: types.COMPARISON_GET,
  };
}

export function changeLoad(section, data) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_LOAD,
    payload: data,
  };
}

export function changeLoadReset() {
  return {
    type: types.CHANGE_LOAD_RESET,
  };
}

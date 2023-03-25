import * as types from './constants';

export function getPreQuoted() {
  return {
    type: types.PRE_QUOTED_GET,
  };
}

export function getPreQuotedSuccess(data) {
  return {
    type: types.PRE_QUOTED_GET_SUCCESS,
    payload: data,
  };
}

export function getPreQuotedError(error) {
  return {
    type: types.PRE_QUOTED_GET_ERROR,
    payload: error,
  };
}

export function changePreQuotedSort(prop, order) {
  return {
    type: types.CHANGE_PRE_QUOTED_SORT,
    payload: { prop, order },
  };
}

/*
 *
 * ClearValue actions
 *
 */

import * as types from './constants';

export function changeClearValue(key, value) {
  return {
    type: types.CHANGE_CLEAR_VALUE,
    payload: { key, value },
  };
}

export function clearValueCalculate() {
  return {
    type: types.CLEAR_VALUE_CALCULATE,
  };
}

/*
 *
 * Optimizer actions
 *
 */

import * as types from './constants';

export function changeField(key, value) {
  return {
    type: types.CHANGE_FIELD,
    payload: { key, value },
  };
}

export function changeProduct(product, value) {
  return {
    type: types.CHANGE_PRODUCT,
    payload: { product, value },
  };
}

export function changeEditing(value) {
  return {
    type: types.CHANGE_EDITING,
    payload: value,
  };
}

export function changeAddress(key, value) {
  return {
    type: types.CHANGE_ADDRESS,
    payload: { key, value },
  };
}

export function gaGets() {
  return {
    type: types.GA_GET,
  };
}

export function brokerageGets() {
  return {
    type: types.BROKERAGE_GET,
  };
}

export function loadOptimizer(file, add) {
  return {
    type: types.LOAD_OPTIMIZER,
    payload: { file, add },
  };
}

export function validateOptimizer(file) {
  return {
    type: types.VALIDATE_OPTIMIZER,
    payload: { file },
  };
}

export function updateBCC(text) {
  return {
    type: types.UPDATE_BCC,
    payload: text,
  };
}

export function changeRenewal(product, value) {
  return {
    type: types.CHANGE_RENEWAL,
    payload: { product, value },
  };
}

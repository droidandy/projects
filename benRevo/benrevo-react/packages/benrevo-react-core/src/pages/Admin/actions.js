import {
  CHANGE_DISCLOSURE,
  DISCLOSURE_CANCEL,
  DISCLOSURE_SUBMIT,
  GET_CONFIG,
} from './constants';

export function changeForm(value) {
  return {
    type: CHANGE_DISCLOSURE,
    payload: { value },
  };
}

export function cancelForm(value) {
  return {
    type: DISCLOSURE_CANCEL,
    payload: { value },
  };
}

export function formSubmit() {
  return {
    type: DISCLOSURE_SUBMIT,
  };
}

export function getConfig() {
  return {
    type: GET_CONFIG,
  };
}

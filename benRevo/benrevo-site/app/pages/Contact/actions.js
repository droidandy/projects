import {
  CHANGE_FORM,
  FORM_SUBMIT,
} from './constants';

export function changeForm(key, value) {
  return {
    type: CHANGE_FORM,
    payload: { key, value },
  };
}
export function formSubmit() {
  return {
    type: FORM_SUBMIT,
  };
}

import {
  CHANGE_FORM,
  FORM_SUBMIT,
} from './constants';

/**
 * Changes the input field of the form
 *
 * @param  {name} name The new text of the input field
 *
 * @return {object}    An action object with a type of CHANGE_USERNAME
 */

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

import { fromJS } from 'immutable';
import {
  CHANGE_FORM,
  FORM_SUBMIT,
  FORM_SUBMIT_SUCCESS,
  FORM_SUBMIT_ERROR,
} from './constants';

const initialState = fromJS({
  sent: false,
  loading: false,
  form: {
    name: '',
    phoneNumber: '',
    message: '',
    email: '',
  },
});

function contactReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_FORM:
      return state
        .setIn(['form', action.payload.key], action.payload.value);
    case FORM_SUBMIT:
      return state
        .setIn(['loading'], true);
    case FORM_SUBMIT_SUCCESS:
      return state
        .setIn(['loading'], false)
        .setIn(['sent'], true);
    case FORM_SUBMIT_ERROR:
      return state
        .setIn(['loading'], false);
    default:
      return state;
  }
}

export default contactReducer;

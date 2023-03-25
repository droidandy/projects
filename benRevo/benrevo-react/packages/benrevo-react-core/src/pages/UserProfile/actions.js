import { CHANGE_INFO, SET_USER_EULA } from './../../utils/authService/constants';
import {
  SAVE_INFO,
} from './constants';

export function changeInfo(key, value) {
  return {
    type: CHANGE_INFO,
    payload: { key, value },
  };
}


export function setUserEULA(check) {
  return {
    type: SET_USER_EULA,
    check,
  };
}

export function saveInfo() {
  return {
    type: SAVE_INFO,
  };
}

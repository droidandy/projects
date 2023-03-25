import {
  SET_PROFILE,
  LOGOUT,
  ERROR_EXPIRED,
  CHECK_ROLE,
  ERROR_PERMISSION,
} from './constants';

export function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

export function checkRole(skipStatus, nextPathname) {
  return {
    type: CHECK_ROLE,
    payload: { skipStatus, nextPathname },
  };
}

export function setExpired(expired) {
  return {
    type: ERROR_EXPIRED,
    payload: expired,
  };
}

export function setErrorPermission(error) {
  return {
    type: ERROR_PERMISSION,
    payload: error,
  };
}

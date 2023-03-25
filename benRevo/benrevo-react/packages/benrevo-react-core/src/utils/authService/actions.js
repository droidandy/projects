import {
  SET_PROFILE,
  LOGOUT,
  ERROR_EXPIRED,
  GET_USER_STATUS,
  CHANGE_USER_COUNT,
  CHECK_USER_GA,
  CHANGE_ATTRIBUTE,
  CHECK_ROLE,
  SEND_FEEDBACK,
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

export function setExpired(expired) {
  return {
    type: ERROR_EXPIRED,
    payload: expired,
  };
}

export function getUserCount() {
  return {
    type: GET_USER_STATUS,
  };
}

export function checkUserGA() {
  return {
    type: CHECK_USER_GA,
  };
}

export function changeUserCount() {
  return {
    type: CHANGE_USER_COUNT,
  };
}

export function changeAttribute(attribute) {
  return {
    type: CHANGE_ATTRIBUTE,
    payload: attribute,
  };
}

export function checkRole(skipStatus, nextPathname) {
  return {
    type: CHECK_ROLE,
    payload: { skipStatus, nextPathname },
  };
}

export function sendFeedback(page, text, feedbackType, metadata) {
  return {
    type: SEND_FEEDBACK,
    payload: { page, text, feedbackType, metadata },
  };
}

import {
  REGISTER_USER_REQUESTED,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED,
  LOGIN_EMAIL_REQUESTED,
  LOGIN_EMAIL_SUCCESS,
  LOGIN_EMAIL_FAILED,
  SAVE_PROFILE_REQUESTED,
  SAVE_PROFILE_SUCCESS,
  SAVE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUESTED,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  GET_PROFILE_REQUESTED,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILED,
  LOG_OUT
} from './authConstants';

// ------------------------------------
// Register User actions
// ------------------------------------
export const registerUser = {
  request: user => ({ type: REGISTER_USER_REQUESTED, payload: user }),
  success: data => ({ type: REGISTER_USER_SUCCESS, payload: data }),
  failure: error => ({ type: REGISTER_USER_FAILED, error })
};

// ------------------------------------
// Login via Email/Password actions
// ------------------------------------
export const loginEmail = {
  request: user => ({ type: LOGIN_EMAIL_REQUESTED, payload: user }),
  success: data => ({ type: LOGIN_EMAIL_SUCCESS, payload: data }),
  failure: error => ({ type: LOGIN_EMAIL_FAILED, error })
};

// ------------------------------------
// Save User Profile actions
// ------------------------------------
export const saveProfile = {
  request: data => ({ type: SAVE_PROFILE_REQUESTED, payload: data }),
  success: data => ({ type: SAVE_PROFILE_SUCCESS, payload: data }),
  failure: error => ({ type: SAVE_PROFILE_FAILED, error })
};

// ------------------------------------
// Update User Profile actions
// ------------------------------------
export const updateProfile = {
  request: data => ({ type: UPDATE_PROFILE_REQUESTED, payload: data }),
  success: data => ({ type: UPDATE_PROFILE_SUCCESS, payload: data }),
  failure: error => ({ type: UPDATE_PROFILE_FAILED, error })
};

// ------------------------------------
// Get User Profile actions
// ------------------------------------
export const getProfile = {
  request: email => ({ type: GET_PROFILE_REQUESTED, payload: email }),
  success: data => ({ type: GET_PROFILE_SUCCESS, payload: data }),
  failure: error => ({ type: GET_PROFILE_FAILED, error })
};

// ------------------------------------
// LogOut action
// ------------------------------------
export const logOut = () => ({ type: LOG_OUT });

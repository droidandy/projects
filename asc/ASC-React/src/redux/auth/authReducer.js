import { initialState } from './authSelectors';
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

export default (state = initialState, action) => {
  switch (action.type) {
    // ------------------------------------
    // REGISTER_USER
    // ------------------------------------
    case REGISTER_USER_REQUESTED:
      return {
        ...state,
        isLogin: false,
        userAuthData: null,
        token: null,
        errors: { ...state.errors, registerUser: false }
      };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        isLogin: true,
        ...action.payload
      };
    case REGISTER_USER_FAILED:
      return {
        ...state,
        isLogin: false,
        errors: { ...state.errors, registerUser: action.error }
      };
    // ------------------------------------
    // LOGIN_EMAIL
    // ------------------------------------
    case LOGIN_EMAIL_REQUESTED:
      return {
        ...state,
        isLogin: false,
        userAuthData: null,
        token: null,
        errors: { ...state.errors, loginEmail: false }
      };
    case LOGIN_EMAIL_SUCCESS:
      return {
        ...state,
        isLogin: true,
        ...action.payload
      };
    case LOGIN_EMAIL_FAILED:
      return {
        ...state,
        isLogin: false,
        errors: { ...state.errors, loginEmail: action.error }
      };
    // ------------------------------------
    // SAVE_PROFILE
    // ------------------------------------
    case SAVE_PROFILE_REQUESTED:
      return {
        ...state,
        userProfile: null,
        errors: { ...state.errors, saveProfile: false }
      };
    case SAVE_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload
      };
    case SAVE_PROFILE_FAILED:
      return {
        ...state,
        errors: { ...state.errors, saveProfile: action.error }
      };
    // ------------------------------------
    // UPDATE_PROFILE
    // ------------------------------------
    case UPDATE_PROFILE_REQUESTED:
      return {
        ...state,
        userProfile: null,
        errors: { ...state.errors, updateProfile: false }
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload
      };
    case UPDATE_PROFILE_FAILED:
      return {
        ...state,
        errors: { ...state.errors, updateProfile: action.error }
      };
    // ------------------------------------
    // GET_PROFILE
    // ------------------------------------
    case GET_PROFILE_REQUESTED:
      return {
        ...state,
        userProfile: null,
        errors: { ...state.errors, getProfile: false }
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload
      };
    case GET_PROFILE_FAILED:
      return {
        ...state,
        errors: { ...state.errors, getProfile: action.error }
      };
    // ------------------------------------
    // LOG_OUT
    // ------------------------------------
    case LOG_OUT:
      return {
        ...initialState
        // Add some store changes here
      };
    default:
      return state;
  }
};

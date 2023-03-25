import { fromJS, Set } from 'immutable';
import {
  SET_PROFILE,
  LOGOUT,
  ERROR_EXPIRED,
  CHANGE_INFO,
  SET_USER_EULA,
  GET_USER_STATUS_SUCCESS,
  GET_USER_STATUS,
  GET_USER_STATUS_ERROR,
  CHANGE_USER_COUNT,
  CHECK_USER_GA_SUCCESS,
  CHECK_USER_GA,
  CHECK_USER_GA_ERROR,
  CHANGE_ATTRIBUTE,
} from './constants';

export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const NAME = 'name';
export const EMAIL = 'email';
export const PICTURE = 'picture';
export const BROKERAGE = 'brokerage';
export const BROKERAGE_ROLE = 'brokerageRole';
export const BROKERAGE_LOGO = 'brokerageLogo';
export const EXPIRED = 'expired';
export const LOGIN_COUNT = 'loginCount';
export const LOGIN_COUNT_LOADING = 'loginCountLoading';
export const IS_GA = 'isGA';
export const IS_GA_LOADING = 'isGALoading';
export const GA_BROKERAGES = 'brokerages';
export const ATTRIBUTES = 'attributes';

export const initialState = fromJS({
  firstName: '',
  lastName: '',
  loginCount: null,
  loginCountLoading: true,
  isGALoading: true,
  expired: null,
  userMetadata: {},
  userEULA: false,
  isGA: false,
  brokerages: [],
  attributes: null,
  brokerageRole: ['user'],
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PROFILE: {
      let role = ['user'];

      if (action.profile.roles) role = action.profile.roles;

      return state
        .set(FIRST_NAME, action.profile.firstName)
        .set(LAST_NAME, action.profile.lastName)
        .set(NAME, action.profile.name)
        .set(EMAIL, action.profile.email)
        .set(PICTURE, action.profile.picture)
        .set(BROKERAGE, action.profile.brokerName)
        .set(BROKERAGE_LOGO, action.profile.brokerageLogo)
        .set(BROKERAGE_ROLE, fromJS(role))
        .set(EXPIRED, false);
    }
    case CHANGE_INFO:
      return state
        .setIn([action.payload.key], action.payload.value);
    case SET_USER_EULA:
      return state
        .set('userEULA', action.check);
    case LOGOUT:
      return state.clear();
    case ERROR_EXPIRED:
      return state
        .set(EXPIRED, action.payload);
    case GET_USER_STATUS:
      return state
        .set(LOGIN_COUNT_LOADING, true);
    case GET_USER_STATUS_SUCCESS:
      return state
        .set(LOGIN_COUNT, action.payload.loginCount)
        .set(ATTRIBUTES, Set(action.payload.attributes))
        .set(LOGIN_COUNT_LOADING, false);
    case GET_USER_STATUS_ERROR:
      return state
        .set(LOGIN_COUNT_LOADING, false);
    case CHANGE_USER_COUNT:
      return state
        .set(LOGIN_COUNT, 2);
    case CHECK_USER_GA:
      return state
        .set(IS_GA_LOADING, true);
    case CHECK_USER_GA_SUCCESS:
      return state
        .set(IS_GA, action.payload.check)
        .set(IS_GA_LOADING, false)
        .set(GA_BROKERAGES, fromJS(action.payload.brokerages));
    case CHECK_USER_GA_ERROR:
      return state
        .set(IS_GA_LOADING, false);
    case CHANGE_ATTRIBUTE: {
      let attributes = Set(state.get(ATTRIBUTES));
      attributes = attributes.add(action.payload);
      return state
        .set(ATTRIBUTES, attributes);
    }
    default:
      return state;
  }
}

export default authReducer;

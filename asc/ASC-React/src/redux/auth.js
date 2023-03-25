// import _ from 'lodash';
import * as API from '../api/api';

const TYPE = {
  ADD_FACEBOOK_TOKEN: 'ADD_FACEBOOK_TOKEN',
  ADD_DATAFACEBOOK: 'ADD_DATAFACEBOOK',
  REGISTER_FACEBOOK_REQUESTED: 'REGISTER_FACEBOOK_REQUESTED',
  REGISTER_FACEBOOK_SUCCESS: 'REGISTER_FACEBOOK_SUCCESS',
  REGISTER_FACEBOOK_FAILED: 'REGISTER_FACEBOOK_FAILED',
  LOGIN_FACEBOOK_REQUESTED: 'LOGIN_FACEBOOK_REQUESTED',
  LOGIN_FACEBOOK_SUCCESS: 'LOGIN_FACEBOOK_SUCCESS',
  LOGIN_FACEBOOK_FAILED: 'LOGIN_FACEBOOK_FAILED'
};

export const registerFBUser = (user) => {
  return dispatch => {
    let userAuth;
    let token;
    let params;
    let url = '';

    params = {
      facebookAccessToken: user.facebookAccessToken
    };

    return dispatch({
      types: [TYPE.REGISTER_FACEBOOK_REQUESTED, TYPE.REGISTER_FACEBOOK_SUCCESS, TYPE.REGISTER_FACEBOOK_FAILED],
      promise: API.post(url, params, 'AUTH', false)
        .then(response => {
          userAuth = response;
          // console.log('FACEBOOK_response', response);
          url = '/login/basic';

          params = {
            facebookAccessToken: user.facebookAccessToken
          };
          return API.post(url, params, 'AUTH', false);
        })
        .then(tokenResponse => {
          token = tokenResponse;

          window.localStorage.setItem('token', token);
          url = '';
          params = {
            identityID: userAuth._id,
            culture: user.regInfo ? user.regInfo : ''
          };
          return API.post(url, params, 'USER', true);
        })
        .then(profileResponse => {
          return ({ token, userAuth, userProfile: profileResponse, success: true });
        })
    });
  };
};

export const loginFBUser = (fbToken) => {
  return dispatch => {
    let url = '/login/facebook';
    let params = {facebookAccessToken: fbToken};

    return dispatch({
      types: [TYPE.LOGIN_FACEBOOK_REQUESTED, TYPE.LOGIN_FACEBOOK_SUCCESS, TYPE.LOGIN_FACEBOOK_FAILED],
      promise: API.post(url, params, 'AUTH', false)
        .then((response) => {
          return ({ response });
        })
    });
  };
};

const initialState = {
  isLogin: false,
  fbToken: null,
  token: null,
  fbAuthData: null,
  userAuthData: null,
  userProfile: null,
  error: null
};

export default (_state = initialState, action = {}) => {
  let state = {..._state};
  switch (action.type) {
    case TYPE.ADD_FACEBOOK_TOKEN:
      return {
        ...state,
        fbToken: action.fbToken
      };
    case TYPE.REGISTER_FACEBOOK_REQUESTED:
      return {
        ...state,
        token: null,
        error: null
      };
    case TYPE.REGISTER_FACEBOOK_SUCCESS:
      let registerFBResponse = action.result;
      return {
        ...state,
        userAuthData: {
          email: registerFBResponse.userAuth.email,
          identityID: registerFBResponse.userAuth._id,
          profile: registerFBResponse.userProfile
        },
        token: registerFBResponse.token
      };
    case TYPE.REGISTER_FACEBOOK_FAILED:
      return {
        ...state,
        error: action.error.response.data
      };
    case TYPE.LOGIN_FACEBOOK_REQUESTED:
      return {
        ...state,
        error: null
      };
    case TYPE.LOGIN_FACEBOOK_SUCCESS:
      return {
        ...state
      };
    case TYPE.LOGIN_FACEBOOK_FAILED:
      return {
        ...state,
        error: action.error.response.data
      };
    default:
      return state;
  }
};

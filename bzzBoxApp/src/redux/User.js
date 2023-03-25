/**
 * Created by konstantin on 29.07.16.
 */

const TYPES = {
  USER_SIGN_IN: 'USER_SIGN_IN',
  USER_TOKEN: 'USER_TOKEN',
  SET_PLAYER_ID: 'SET_PLAYER_ID',
  USER_SIGN_OUT: 'USER_SIGN_OUT',
  USER_SIGN_OUT_REQUEST: 'USER_SIGN_OUT_REQUEST'
};

export const USER_SIGN_OUT = TYPES.USER_SIGN_OUT;
export const USER_SIGN_OUT_REQUEST = TYPES.USER_SIGN_OUT_REQUEST;

export const userSignIn = userInfo => ({
  type: TYPES.USER_SIGN_IN,
  userInfo
});

export const userToken = token => ({
  type: TYPES.USER_TOKEN,
  token
});

export const setPlayerId = playerId => ({
  type: TYPES.SET_PLAYER_ID,
  playerId
});

export const userSignOutRequest = () => ({
  type: USER_SIGN_OUT_REQUEST
});

const initialState = {
  userInfo: {
    name: '',
    avatar: ''
  },
  token: null,
  playerId: null
};

export default (_state = initialState, action = {}) => {

  let state = { ..._state };

  switch (action.type) {
    case TYPES.USER_SIGN_IN:
      state.userInfo = action.userInfo.user;
      state.token = action.userInfo.token;
      break;
    case TYPES.USER_TOKEN:
      state.token = action.token;
      break;
    case TYPES.SET_PLAYER_ID:
      state.playerId = action.playerId;
      break;
    case USER_SIGN_OUT:
      state = initialState;
      break;
    default:
      break;
  }
  return state;
};

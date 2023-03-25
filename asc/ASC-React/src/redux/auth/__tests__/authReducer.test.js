import { initialState } from '../authSelectors';
import * as constants from '../authConstants';
import reducer from '../authReducer';

// ------------------------------------
// TEST Initial State
// ------------------------------------
it('returns the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState);
});

// ------------------------------------
// TEST REGISTER_USER_REQUESTED
// ------------------------------------
it('handles REGISTER_USER_REQUESTED', () => {
  expect(reducer(initialState, {
    type: constants.REGISTER_USER_REQUESTED
  })).toEqual({
    ...initialState,
    isLogin: false,
    userAuthData: null,
    token: null,
    errors: { ...initialState.errors, registerUser: false }
  });
});

// ------------------------------------
// TEST REGISTER_USER_SUCCESS
// ------------------------------------
it('handles REGISTER_USER_SUCCESS', () => {
  const data = { foo: 'baz' };

  expect(reducer(initialState, {
    type: constants.REGISTER_USER_SUCCESS,
    payload: data
  })).toEqual({
    ...initialState,
    isLogin: true,
    ...data
  });
});

// ------------------------------------
// TEST REGISTER_USER_FAILED
// ------------------------------------
it('handles REGISTER_USER_FAILED', () => {
  const error = 'test';

  expect(reducer(initialState, {
    type: constants.REGISTER_USER_FAILED,
    error
  })).toEqual({
    ...initialState,
    isLogin: false,
    errors: { ...initialState.errors, registerUser: error }
  });
});

// ------------------------------------
// TEST LOGIN_EMAIL_REQUESTED
// ------------------------------------
it('handles LOGIN_EMAIL_REQUESTED', () => {
  expect(reducer(initialState, {
    type: constants.LOGIN_EMAIL_REQUESTED
  })).toEqual({
    ...initialState,
    isLogin: false,
    userAuthData: null,
    token: null,
    errors: { ...initialState.errors, loginEmail: false }
  });
});

// ------------------------------------
// TEST LOGIN_EMAIL_SUCCESS
// ------------------------------------
it('handles LOGIN_EMAIL_SUCCESS', () => {
  const data = { foo: 'baz' };

  expect(reducer(initialState, {
    type: constants.LOGIN_EMAIL_SUCCESS,
    payload: data
  })).toEqual({
    ...initialState,
    isLogin: true,
    ...data
  });
});

// ------------------------------------
// TEST LOGIN_EMAIL_FAILED
// ------------------------------------
it('handles LOGIN_EMAIL_FAILED', () => {
  const error = 'test';

  expect(reducer(initialState, {
    type: constants.LOGIN_EMAIL_FAILED,
    error
  })).toEqual({
    ...initialState,
    isLogin: false,
    errors: { ...initialState.errors, loginEmail: error }
  });
});

// ------------------------------------
// TEST SAVE_PROFILE_REQUESTED
// ------------------------------------
it('handles SAVE_PROFILE_REQUESTED', () => {
  expect(reducer(initialState, {
    type: constants.SAVE_PROFILE_REQUESTED
  })).toEqual({
    ...initialState,
    userProfile: null,
    errors: { ...initialState.errors, saveProfile: false }
  });
});

// ------------------------------------
// TEST SAVE_PROFILE_SUCCESS
// ------------------------------------
it('handles SAVE_PROFILE_SUCCESS', () => {
  const data = { foo: 'baz' };

  expect(reducer(initialState, {
    type: constants.SAVE_PROFILE_SUCCESS,
    payload: data
  })).toEqual({
    ...initialState,
    userProfile: data
  });
});

// ------------------------------------
// TEST SAVE_PROFILE_FAILED
// ------------------------------------
it('handles SAVE_PROFILE_FAILED', () => {
  const error = 'test';

  expect(reducer(initialState, {
    type: constants.SAVE_PROFILE_FAILED,
    error
  })).toEqual({
    ...initialState,
    errors: { ...initialState.errors, saveProfile: error }
  });
});

// ------------------------------------
// TEST UPDATE_PROFILE_REQUESTED
// ------------------------------------
it('handles UPDATE_PROFILE_REQUESTED', () => {
  expect(reducer(initialState, {
    type: constants.UPDATE_PROFILE_REQUESTED
  })).toEqual({
    ...initialState,
    userProfile: null,
    errors: { ...initialState.errors, updateProfile: false }
  });
});

// ------------------------------------
// TEST UPDATE_PROFILE_SUCCESS
// ------------------------------------
it('handles UPDATE_PROFILE_SUCCESS', () => {
  const data = { foo: 'baz' };

  expect(reducer(initialState, {
    type: constants.UPDATE_PROFILE_SUCCESS,
    payload: data
  })).toEqual({
    ...initialState,
    userProfile: data
  });
});

// ------------------------------------
// TEST UPDATE_PROFILE_FAILED
// ------------------------------------
it('handles UPDATE_PROFILE_FAILED', () => {
  const error = 'test';

  expect(reducer(initialState, {
    type: constants.UPDATE_PROFILE_FAILED,
    error
  })).toEqual({
    ...initialState,
    errors: { ...initialState.errors, updateProfile: error }
  });
});

// ------------------------------------
// TEST GET_PROFILE_REQUESTED
// ------------------------------------
it('handles GET_PROFILE_REQUESTED', () => {
  expect(reducer(initialState, {
    type: constants.GET_PROFILE_REQUESTED
  })).toEqual({
    ...initialState,
    userProfile: null,
    errors: { ...initialState.errors, getProfile: false }
  });
});

// ------------------------------------
// TEST GET_PROFILE_SUCCESS
// ------------------------------------
it('handles GET_PROFILE_SUCCESS', () => {
  const data = { foo: 'baz' };

  expect(reducer(initialState, {
    type: constants.GET_PROFILE_SUCCESS,
    payload: data
  })).toEqual({
    ...initialState,
    userProfile: data
  });
});

// ------------------------------------
// TEST GET_PROFILE_FAILED
// ------------------------------------
it('handles GET_PROFILE_FAILED', () => {
  const error = 'test';

  expect(reducer(initialState, {
    type: constants.GET_PROFILE_FAILED,
    error
  })).toEqual({
    ...initialState,
    errors: { ...initialState.errors, getProfile: error }
  });
});

// ------------------------------------
// TEST LOG_OUT
// ------------------------------------
it('handles LOG_OUT', () => {
  expect(reducer(initialState, {
    type: constants.LOG_OUT
  })).toEqual({
    ...initialState
  });
});

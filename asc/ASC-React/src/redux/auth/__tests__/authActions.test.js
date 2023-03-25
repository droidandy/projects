import * as constants from '../authConstants';
import * as actions from '../authActions';

// ------------------------------------
// TEST Register User actions
// ------------------------------------
test('registerUser', () => {
  expect(actions.registerUser.request('test')).toEqual({
    type: constants.REGISTER_USER_REQUESTED,
    payload: 'test'
  });

  expect(actions.registerUser.success('test')).toEqual({
    type: constants.REGISTER_USER_SUCCESS,
    payload: 'test'
  });

  expect(actions.registerUser.failure('test')).toEqual({
    type: constants.REGISTER_USER_FAILED,
    error: 'test'
  });
});

// ------------------------------------
// TEST Login via Email/Password actions
// ------------------------------------
test('loginEmail', () => {
  expect(actions.loginEmail.request('test')).toEqual({
    type: constants.LOGIN_EMAIL_REQUESTED,
    payload: 'test'
  });

  expect(actions.loginEmail.success('test')).toEqual({
    type: constants.LOGIN_EMAIL_SUCCESS,
    payload: 'test'
  });

  expect(actions.loginEmail.failure('test')).toEqual({
    type: constants.LOGIN_EMAIL_FAILED,
    error: 'test'
  });
});

// ------------------------------------
// TEST Save User Profile actions
// ------------------------------------
test('saveProfile', () => {
  expect(actions.saveProfile.request('test')).toEqual({
    type: constants.SAVE_PROFILE_REQUESTED,
    payload: 'test'
  });

  expect(actions.saveProfile.success('test')).toEqual({
    type: constants.SAVE_PROFILE_SUCCESS,
    payload: 'test'
  });

  expect(actions.saveProfile.failure('test')).toEqual({
    type: constants.SAVE_PROFILE_FAILED,
    error: 'test'
  });
});

// ------------------------------------
// TEST Update User Profile actions
// ------------------------------------
test('updateProfile', () => {
  expect(actions.updateProfile.request('test')).toEqual({
    type: constants.UPDATE_PROFILE_REQUESTED,
    payload: 'test'
  });

  expect(actions.updateProfile.success('test')).toEqual({
    type: constants.UPDATE_PROFILE_SUCCESS,
    payload: 'test'
  });

  expect(actions.updateProfile.failure('test')).toEqual({
    type: constants.UPDATE_PROFILE_FAILED,
    error: 'test'
  });
});

// ------------------------------------
// TEST Get User Profile actions
// ------------------------------------
test('getProfile', () => {
  expect(actions.getProfile.request('test')).toEqual({
    type: constants.GET_PROFILE_REQUESTED,
    payload: 'test'
  });

  expect(actions.getProfile.success('test')).toEqual({
    type: constants.GET_PROFILE_SUCCESS,
    payload: 'test'
  });

  expect(actions.getProfile.failure('test')).toEqual({
    type: constants.GET_PROFILE_FAILED,
    error: 'test'
  });
});

// ------------------------------------
// TEST LogOut action
// ------------------------------------
test('getProfile', () => {
  expect(actions.logOut()).toEqual({ type: constants.LOG_OUT });
});

import * as selectors from '../authSelectors';

const state = {
  auth: {
    isLogin: false,
    fbToken: null,
    token: null,
    fbAuthData: null,
    userAuthData: null,
    userProfile: null,
    errors: {}
  }
};

// ------------------------------------
// TEST Auth Initial State
// ------------------------------------
test('initialState', () => {
  expect(selectors.initialState).toEqual(state.auth);
});

// ------------------------------------
// TEST Selectors
// ------------------------------------
test('getAuth', () => {
  expect(selectors.getAuth(state)).toEqual(state.auth);
});

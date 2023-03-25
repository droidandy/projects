// ------------------------------------
// Auth Initial State
// ------------------------------------
export const initialState = {
  isLogin: false,
  fbToken: null,
  token: null,
  fbAuthData: null,
  userAuthData: null,
  userProfile: null,
  errors: {}
};

// ------------------------------------
// Selectors
// ------------------------------------
export const getAuth = state => state.auth;

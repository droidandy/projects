import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import { getAuth } from './authSelectors';
import { callApi } from '../../api/api';
import { retry } from '../../utils/sagaHelpers';
import { getAuthToken, setAuthToken } from '../../utils/localStorageStore';
import {
  REGISTER_USER_REQUESTED,
  LOGIN_EMAIL_REQUESTED,
  SAVE_PROFILE_REQUESTED,
  UPDATE_PROFILE_REQUESTED,
  GET_PROFILE_REQUESTED,
  GET_PROFILE_SUCCESS
} from './authConstants';
import {
  registerUser,
  loginEmail,
  saveProfile,
  updateProfile,
  getProfile
} from './authActions';

// ------------------------------------
// Retry for auth requests
// ------------------------------------
export const retryAuth = retry({ delay: 1000, attempt: 5 });

// ------------------------------------
// Get Token saga
// ------------------------------------
export function * getToken(body) {
  const params = {
    method: 'POST',
    api: 'AUTH',
    endpoint: '/login/basic',
    body
  };

  const data = yield call(retryAuth, callApi, params);

  yield call(setAuthToken, data);
}

// ------------------------------------
// Get User Profile Flow
// ------------------------------------
export function * getProfileFlow(action) {
  try {
    const params = {
      api: 'USER',
      endpoint: `?publicEmail=${action.payload}`,
      token: true
    };

    const data = yield call(retryAuth, callApi, params);

    yield put(getProfile.success(data[0]));
  } catch (error) {
    yield put(getProfile.failure(error));
  }
}

// ------------------------------------
// Update User Profile Flow
// ------------------------------------
export function * updateProfileFlow(action) {
  try {
    const { profileID, profile: body } = action.payload;

    const params = {
      method: 'PUT',
      api: 'USER',
      endpoint: `/${profileID}`,
      body,
      token: true
    };

    const data = yield call(retryAuth, callApi, params);

    yield put(updateProfile.success(data));
  } catch (error) {
    yield put(updateProfile.failure(error));
  }
}

// ------------------------------------
// Save User Profile Flow
// ------------------------------------
export function * saveProfileFlow(action) {
  try {
    const params = {
      method: 'POST',
      api: 'USER',
      body: action.payload,
      token: true
    };

    const data = yield call(retryAuth, callApi, params);

    yield put(saveProfile.success(data));
  } catch (error) {
    yield put(saveProfile.failure(error));
  }
}

// ------------------------------------
// Login vie Email/Password Flow
// ------------------------------------
export function * loginEmailFlow(action) {
  try {
    const { email, password } = action.payload;

    const body = { email, password };

    yield call(getToken, body);
    const token = yield call(getAuthToken);

    yield put(getProfile.request(email));
    yield take(GET_PROFILE_SUCCESS);

    const auth = yield select(getAuth);

    const userAuthData = { email, identityID: auth.userProfile.identityID };

    yield put(loginEmail.success({ userAuthData, token }));
  } catch (error) {
    yield put(loginEmail.failure(error));
  }
}

// ------------------------------------
// Register User Flow
// ------------------------------------
export function * registerUserFlow(action) {
  try {
    const { email, password, regInfo, addProfile } = action.payload;

    const body = { email, password };

    const params = { method: 'POST', api: 'AUTH', body };

    const user = yield call(retryAuth, callApi, params);

    yield call(getToken, body);
    const token = yield call(getAuthToken);

    const { _id: identityID } = user;
    const profile = { identityID, culture: regInfo || '', ...addProfile };

    yield put(saveProfile.request(profile));

    const userAuthData = { email, identityID };

    yield put(registerUser.success({ userAuthData, token }));
  } catch (error) {
    const { message, errors } = error;
    yield put(registerUser.failure({ message, errors }));
  }
}

// ------------------------------------
// Watch Auth saga
// ------------------------------------
export function * watchAuth() {
  yield takeEvery(REGISTER_USER_REQUESTED, registerUserFlow);
  yield takeEvery(LOGIN_EMAIL_REQUESTED, loginEmailFlow);
  yield takeEvery(SAVE_PROFILE_REQUESTED, saveProfileFlow);
  yield takeEvery(UPDATE_PROFILE_REQUESTED, updateProfileFlow);
  yield takeEvery(GET_PROFILE_REQUESTED, getProfileFlow);
}

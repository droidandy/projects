import { takeEvery, call, put } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import {
  LOGOUT,
  CHECK_ROLE,
  GET_USER_INFO,
  GET_USER_INFO_ERROR,
  GET_USER_INFO_SUCCESS,
} from './constants';
import { loggedIn, removeToken, getRole } from './lib';
import { logout, setErrorPermission, setExpired, setProfile } from './actions';
import { checkingRole } from '../../pages/App/actions';
import request from '../../utils/request';
import { BENREVO_API_PATH } from '../../config';

function* naviagateHome() {
  // do full page load on logout;
  removeToken();
  yield put(replace({
    pathname: '/login',
  }));
  yield put(checkingRole(false));
}

export function* checkRole(action) {
  if (loggedIn()) {
    yield put(checkingRole(true));
    const profile = yield call(getUserInfo);
    let allow = null;

    if (getRole(profile, ['superadmin'])) {
      allow = true;
    }

    if (allow) {
      yield put(logout());
      if (!profile.expired) yield put(setErrorPermission(true));
      else yield put(setExpired(true));
    } else {
      yield put(setProfile(profile));
      yield put(checkingRole(false));
      yield put(setErrorPermission(false));
    }

    if (action.payload.nextPathname) {
      yield put(replace({
        pathname: action.payload.nextPathname,
      }));
    }
  } else yield put(checkingRole(false));
}

export function* getUserInfo() {
  try {
    const ops = {
      method: 'GET',
    };
    const data = yield call(request, `${BENREVO_API_PATH}/v1/accounts/users/userInfo`, ops);
    yield put({ type: GET_USER_INFO_SUCCESS, payload: data });
    return data;
  } catch (error) {
    yield put({ type: GET_USER_INFO_ERROR, payload: error });
    return error;
  }
}

function* watchAuth() {
  yield takeEvery(LOGOUT, naviagateHome);
  yield takeEvery(CHECK_ROLE, checkRole);
  yield takeEvery(GET_USER_INFO, getUserInfo);
}

export default watchAuth;

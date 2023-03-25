import { takeEvery, put, call } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { setProfile, getToken, removeToken, LOGOUT, CHECK_ROLE, storeProfile, getUserInfo } from '@benrevo/benrevo-react-core';
import { checkingRole } from '../../pages/App/actions';

function* naviagateHome() {
  // do full page load on logout;
  yield put(checkingRole(false));

  window.location.assign('/');
}

export function* checkRole(action) {
  if (getToken()) {
    yield put(checkingRole(true));
    // const profile = yield call(getProfile);
    const profile = yield call(getUserInfo);
    if (profile.message) {
      const { pathname } = browserHistory.getCurrentLocation();
      const currentPath = pathname.substr(0, pathname.length);
      removeToken();
      yield put(replace({
        pathname: '/login',
        state: { nextPathname: currentPath },
      }));
      yield put(checkingRole(false));
    } else {
      storeProfile(profile);
      yield put(setProfile(profile));
      if (profile.app_metadata) {
        // const role = profile.app_metadata.roles;
      }

      yield put(checkingRole(false));
    }

    if (action.payload.nextPathname) {
      yield put(replace({
        pathname: action.payload.nextPathname,
      }));
    }
  } else yield put(checkingRole(false));
}

export function* watchAuth() {
  yield takeEvery(LOGOUT, naviagateHome);
  yield takeEvery(CHECK_ROLE, checkRole);
}

export default {
  watchAuth,
};

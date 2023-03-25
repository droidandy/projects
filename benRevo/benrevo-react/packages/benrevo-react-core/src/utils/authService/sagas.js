import { takeEvery, put, call } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { success } from 'react-notification-system-redux';
import { browserHistory } from 'react-router';
import {
  LOGOUT,
  GET_USER_STATUS,
  GET_USER_STATUS_SUCCESS,
  GET_USER_STATUS_ERROR,
  CHECK_USER_GA,
  CHECK_USER_GA_SUCCESS,
  CHECK_USER_GA_ERROR,
  CHANGE_ATTRIBUTE,
  CHANGE_ATTRIBUTE_SUCCESS,
  CHANGE_ATTRIBUTE_ERROR,
  CHECK_ROLE,
  ROLE_IMPLEMENTATION_MANAGER,
  SEND_FEEDBACK,
  SEND_FEEDBACK_ERROR,
  SEND_FEEDBACK_SUCCESS,
  GET_USER_INFO,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_ERROR,
} from './constants';
import request from '../../utils/request';
import { getUserCount, checkUserGA, setProfile } from './actions';
import { getToken, storeProfile, removeToken, getRole } from './lib';
import { checkingRole } from '../../pages/App/actions';
import { BENREVO_PATH, BENREVO_API_PATH } from '../../config';

function* naviagateHome() {
  // do full page load on logout;
  yield put(checkingRole(false));
  window.location.assign(BENREVO_PATH); // UHC_PATH_FIX
}

export function* getUserStatus() {
  // console.log(process.env);

  const url = `${BENREVO_API_PATH}/v1/accounts/users/status`;
  const ops = {
    method: 'GET',
  };
  try {
    const data = yield call(request, url, ops);
    yield put({ type: GET_USER_STATUS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_USER_STATUS_ERROR, payload: error });
  }
}

export function* changeAttribute(action) {
  const ops = {
    method: 'POST',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/accounts/users/attribute?attribute=${action.payload}`;
    const data = yield call(request, url, ops);
    yield put({ type: CHANGE_ATTRIBUTE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: CHANGE_ATTRIBUTE_ERROR, payload: error });
  }
}

export function* getUserGA() {
  try {
    let brokerages = [];
    let ops = {
      method: 'GET',
    };
    const check = yield call(request, `${BENREVO_API_PATH}/v1/brokers/ga`, ops);

    if (check) {
      ops = {
        method: 'GET',
      };
      brokerages = yield call(request, `${BENREVO_API_PATH}/v1/brokers/ga/access`, ops);
    }

    yield put({ type: CHECK_USER_GA_SUCCESS, payload: { check, brokerages } });
  } catch (error) {
    yield put({ type: CHECK_USER_GA_ERROR, payload: error });
  }
}

export function* checkRole(action) {
  const skipStatus = action.payload.skipStatus;
  if (getToken()) {
    yield put(checkingRole(true));
    const profile = yield call(getUserInfo);
    let hasRole = null;

    if (getRole(profile, [ROLE_IMPLEMENTATION_MANAGER])) {
      hasRole = true;
    }
    if (profile.message) {
      const pathname = browserHistory.getCurrentLocation().pathname;
      const currentPath = pathname.substr(BENREVO_PATH.length - 1, pathname.length);
      removeToken();
      yield put(replace({
        pathname: '/login',
        state: { nextPathname: currentPath },
      }));
      yield put(checkingRole(false));
    } else {
      storeProfile(profile);
      yield put(setProfile(profile));
      if (!skipStatus && !hasRole) yield put(getUserCount());
      if (!hasRole) yield put(checkUserGA());

      yield put(checkingRole(false));
    }

    if (action.payload.nextPathname) {
      yield put(replace({
        pathname: action.payload.nextPathname,
      }));
    }
  } else yield put(checkingRole(false));
}

export function* sendFeedback(action) {
  try {
    const ops = {
      method: 'POST',
    };
    ops.body = JSON.stringify(action.payload);
    ops.headers = new Headers();
    ops.headers.append('Authorization', `Bearer ${getToken()}`);
    yield call(request, `${BENREVO_API_PATH}/v1/sendFeedback`, ops);
    const notificationOpts = {
      message: 'Your feedback was sent successfully!',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put({ type: SEND_FEEDBACK_SUCCESS });
  } catch (error) {
    yield put({ type: SEND_FEEDBACK_ERROR, payload: error });
  }
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

export function* watchAuth() {
  yield takeEvery(LOGOUT, naviagateHome);
  yield takeEvery(GET_USER_STATUS, getUserStatus);
  yield takeEvery(CHANGE_ATTRIBUTE, changeAttribute);
  yield takeEvery(CHECK_ROLE, checkRole);
  yield takeEvery(SEND_FEEDBACK, sendFeedback);
  yield takeEvery(GET_USER_INFO, getUserInfo);
}

export function* watchUserGA() {
  yield takeEvery(CHECK_USER_GA, getUserGA);
}

export default {
  watchAuth,
  watchUserGA,
};

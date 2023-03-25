import { call, put, takeEvery, select } from 'redux-saga/effects';
import mixpanel from 'mixpanel-browser';
import { push } from 'react-router-redux';
import { storeProfile } from './../../utils/authService/lib';
import request from './../../utils/request';
import Logger from './../../logger';
import { selectUserName } from './../../utils/authService/selectors';
import {
SAVE_INFO,
SAVE_INFO_FAILED,
SAVE_INFO_SUCCEEDED,
} from './constants';
import { BENREVO_API_PATH } from '../../config';

export function* saveInfo() {
  const url = `${BENREVO_API_PATH}/v1/accounts/users`;
  const ops = {
    method: 'PUT',
  };
  try {
    const profile = yield select(selectUserName());

    ops.body = JSON.stringify({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });

    const data = yield call(request, url, ops);
    yield put({ type: SAVE_INFO_SUCCEEDED, payload: data });
    storeProfile(data);
    yield put(push('/clients'));
  } catch (err) {
    const errorMini = { message: err.message, stack: err.stack };
    Logger.info('Error saving profile', errorMini);
    mixpanel.track('Error saving profile', errorMini);
    yield put({ type: SAVE_INFO_FAILED, payload: err });
    // console.error('Error saving profile', errorMini);
  }
}

export function* watchFetchData() {
  yield takeEvery(SAVE_INFO, saveInfo);
}

export default [
  watchFetchData,
];

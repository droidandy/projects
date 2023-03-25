import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import {
  ENROLLMENT_GET,
  ENROLLMENT_GET_SUCCESS,
  ENROLLMENT_GET_ERROR,
  ENROLLMENT_SAVE,
  ENROLLMENT_SAVE_SUCCESS,
  ENROLLMENT_SAVE_ERROR,
} from '../constants';
import { selectClient, selectEnrollment } from '../selectors';
import { changeLoad } from '../actions';

export function* getEnrollment() {
  try {
    const client = yield select(selectClient());

    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/plans/enrollments`;

    const data = yield call(request, url);
    yield put({ type: ENROLLMENT_GET_SUCCESS, payload: data });

    yield put(changeLoad('enrollment', { enrollment: false }));
  } catch (err) {
    yield put({ type: ENROLLMENT_GET_ERROR, payload: err });
  }
}

export function* saveEnrollment(action) {
  const section = action.meta.section;
  const ops = {
    method: 'PUT',
  };
  try {
    const contributions = yield select(selectEnrollment(section));
    const url = `${BENREVO_API_PATH}/v1/clients/plans/enrollments`;

    ops.body = JSON.stringify(contributions);

    const data = yield call(request, url, ops);
    yield put({ type: ENROLLMENT_SAVE_SUCCESS, payload: data, meta: { section } });
    yield put(changeLoad(section, { options: true, compare: true, overview: true }));
  } catch (err) {
    yield put({ type: ENROLLMENT_SAVE_ERROR, payload: err, meta: { section } });
  }
}

export function* watchFetchData() {
  yield takeLatest(ENROLLMENT_GET, getEnrollment);
  yield takeEvery(ENROLLMENT_SAVE, saveEnrollment);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

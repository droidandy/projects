import { call, put, select, takeLatest } from 'redux-saga/effects';
import { FORM_SUBMIT, FORM_SUBMIT_ERROR, FORM_SUBMIT_SUCCESS } from './constants';
import { BENREVO_API_PATH } from '../../config';
import { makeSelectForm } from './selectors';
import request from '../../utils/request';

export function* formSubmit() {
  const ops = {
    method: 'POST',
  };
  try {
    const url = `${BENREVO_API_PATH}/requestDemo`;
    const form = yield select(makeSelectForm());

    ops.body = JSON.stringify(form);

    const data = yield call(request, url, ops);

    yield put({ type: FORM_SUBMIT_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: FORM_SUBMIT_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(FORM_SUBMIT, formSubmit);
}

export default [
  watchFetchData,
];

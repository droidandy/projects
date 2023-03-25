import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import { getPreQuotedSuccess, getPreQuotedError } from './actions';

export function* getPreQuoted() {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/clients/preQuoted`;
    const data = yield call(request, url, ops);

    yield put(getPreQuotedSuccess(data));
  } catch (error) {
    yield put(getPreQuotedError(error));
  }
}

export function* watchFetchData() {
  yield takeLatest(types.PRE_QUOTED_GET, getPreQuoted);
}

export default [
  watchFetchData,
];

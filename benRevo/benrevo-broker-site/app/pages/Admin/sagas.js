import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { request } from '@benrevo/benrevo-react-core';
import { BENREVO_API_PATH } from './../../config';
import * as types from './constants';
import { makeSelectCarrierEmailList } from './selectors';

export function* getCarrierEmails() {
  try {
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/v1/brokers/config?type=CARRIER_EMAILS`, ops);
    yield put({ type: types.GET_CARRIER_EMAILS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_CARRIER_EMAILS_ERROR, payload: error });
  }
}

export function* saveCarrierEmails() {
  try {
    const ops = {
      method: 'PUT',
    };
    const carrierEmailList = yield select(makeSelectCarrierEmailList());
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    ops.body = JSON.stringify([
      {
        type: 'CARRIER_EMAILS',
        data: JSON.stringify(carrierEmailList),
      },
    ]);
    const data = yield call(request, `${BENREVO_API_PATH}/v1/brokers/config?type=CARRIER_EMAILS`, ops);
    yield put({ type: types.UPDATE_CARRIER_EMAILS_SUCCESS, payload: data });
    yield put({ type: types.GET_CARRIER_EMAILS });
  } catch (error) {
    yield put({ type: types.UPDATE_CARRIER_EMAILS_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(types.GET_CARRIER_EMAILS, getCarrierEmails);
  yield takeLatest(types.UPDATE_CARRIER_EMAILS, saveCarrierEmails);
  yield takeLatest(types.SAVE_EMAILS, saveCarrierEmails);
  yield takeLatest(types.DELETE_EMAIL_FROM_CARRIER, saveCarrierEmails);
  yield takeLatest(types.CHANGE_APPROVE_CARRIER, saveCarrierEmails);
}

export default [
  watchFetchData,
];

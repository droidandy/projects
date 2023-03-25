import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  selectClientRequest,
} from '@benrevo/benrevo-react-rfp';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import * as types from '../constants';
import { selectDiscounts, selectSummaries, selectSummaryLoaded } from '../selectors';

export function* getQuotePlans() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/quotePlans`;
    const data = yield call(request, url, ops);
    yield put({ type: types.QUOTE_PLANS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.QUOTE_PLANS_GET_ERROR, payload: error });
  }
}

export function* changeDiscount() {
  const ops = {
    method: 'PUT',
  };
  try {
    const client = yield select(selectClientRequest());
    const discounts = yield select(selectDiscounts);
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/quotePlans`;
    ops.body = JSON.stringify(discounts);
    const data = yield call(request, url, ops);
    yield put({ type: types.QUOTE_PLANS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.QUOTE_PLANS_GET_ERROR, payload: error });
  }
}

export function* getSummaries() {
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/admin/clients/${client.id}/quotes/summary/`;
    const data = yield call(request, url);
    yield put({ type: types.SUMMARY_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.SUMMARY_GET_ERROR, payload: err });
  }
}

export function* sendToBroker() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/quotePlans/send`;
    yield call(saveSummaries);
    const data = yield call(request, url, ops);
    yield put({ type: types.SEND_TO_BROKER_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.SEND_TO_BROKER_ERROR, payload: err });
  }
}

export function* saveSummaries() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const summaries = yield select(selectSummaries);
    const summaryLoaded = yield select(selectSummaryLoaded);
    const url = `${BENREVO_API_PATH}/admin/clients/${client.id}/quotes/summary/`;
    const body = {
      medicalNotes: summaries.medical,
      dentalNotes: summaries.dental,
      visionNotes: summaries.vision,
    };

    if (summaryLoaded) ops.method = 'PUT';

    ops.body = JSON.stringify(body);

    const data = yield call(request, url, ops);
    yield put({ type: types.SUMMARY_SAVE_SUCCESS, payload: { data } });
  } catch (err) {
    yield put({ type: types.SUMMARY_SAVE_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.QUOTE_PLANS_GET, getQuotePlans);
  yield takeLatest(types.CHANGE_DISCOUNT, changeDiscount);
  yield takeLatest(types.SUMMARY_GET, getSummaries);
  yield takeLatest(types.SUMMARY_SAVE, saveSummaries);
  yield takeLatest(types.SEND_TO_BROKER, sendToBroker);
}

export default [
  watchFetchData,
];

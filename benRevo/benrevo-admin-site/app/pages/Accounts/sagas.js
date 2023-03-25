import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { selectCurrent, selectReason } from './selectors';
import { requestsGet } from './actions';

export function* getRequests() {
  try {
    const url = `${BENREVO_API_PATH}/admin/accountRequests/all`;
    const data = yield call(request, url);
    yield put({ type: types.REQUESTS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.REQUESTS_GET_ERROR, payload: err });
  }
}

export function* saveRequest() {
  const ops = {
    method: 'PUT',
  };
  try {
    const current = yield select(selectCurrent);
    const url = `${BENREVO_API_PATH}/admin/accountRequests/${current.current.id}`;
    ops.body = JSON.stringify(current.current);
    const data = yield call(request, url, ops);
    yield put({ type: types.SAVE_INFO_SUCCESS, payload: data });
    yield put(requestsGet());
  } catch (err) {
    yield put({ type: types.SAVE_INFO_ERROR, payload: err });
  }
}

export function* getGA() {
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/generalAgents`;
    const data = yield call(request, url);
    yield put({ type: types.GA_GETS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GA_GETS_ERROR, payload: err });
  }
}

export function* getContacts() {
  try {
    const url = `${BENREVO_API_PATH}/admin/accountRequests/contacts`;
    const data = yield call(request, url);
    yield put({ type: types.CONTACTS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.CONTACTS_GET_ERROR, payload: err });
  }
}

export function* getBrokerage() {
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/brokerages`;
    const data = yield call(request, url);
    yield put({ type: types.BROKERAGE_GETS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.BROKERAGE_GETS_ERROR, payload: err });
  }
}

export function* approve() {
  const ops = {
    method: 'PUT',
  };
  try {
    const current = yield select(selectCurrent);
    const url = `${BENREVO_API_PATH}/admin/accountRequests/approve`;
    const payload = {
      accountRequestId: current.current.id,
    };
    // Anthem will have bcc
    if (current.bcc) payload.bcc = current.bcc;
    ops.body = JSON.stringify(payload);
    const data = yield call(request, url, ops);
    yield put({ type: types.APPROVE_SUCCESS, payload: data });
    const notificationOpts = {
      message: 'The account request were successfully approved',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put(requestsGet());
  } catch (err) {
    yield put({ type: types.APPROVE_ERROR, payload: err });
  }
}

export function* decline() {
  const ops = {
    method: 'PUT',
  };
  try {
    const current = yield select(selectCurrent);
    const reason = yield select(selectReason);
    const url = `${BENREVO_API_PATH}/admin/accountRequests/deny`;
    ops.body = JSON.stringify({
      accountRequestId: current.id,
      denyReason: reason,
    });
    const data = yield call(request, url, ops);
    yield put({ type: types.DECLINE_SUCCESS, payload: data });
    const notificationOpts = {
      message: 'The account request were successfully denied',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put(requestsGet());
  } catch (err) {
    yield put({ type: types.DECLINE_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.REQUESTS_GET, getRequests);
  yield takeLatest(types.GA_GET, getGA);
  yield takeLatest(types.CONTACTS_GET, getContacts);
  yield takeLatest(types.BROKERAGE_GET, getBrokerage);
  yield takeLatest(types.SAVE_INFO, saveRequest);
  yield takeLatest(types.APPROVE, approve);
  yield takeLatest(types.DECLINE, decline);
}

export default [
  watchFetchData,
];

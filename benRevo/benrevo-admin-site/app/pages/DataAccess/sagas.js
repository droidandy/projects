import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { success } from 'react-notification-system-redux';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';

export function* getGaClients() {
  try {
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/clients`;
    const data = yield call(request, url);
    yield put({ type: types.GA_CLIENTS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GA_CLIENTS_GET_ERROR, payload: err });
  }
}

export function* removeAccessToClient(action) {
  const clientId = action.payload.clientId;
  try {
    const url = `${BENREVO_API_PATH}/admin/brokers/benrevoGa/remove?clientId=${clientId}`;
    const ops = {
      method: 'DELETE',
    };
    ops.headers = new Headers();
    ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
    const data = yield call(request, url, ops, true);
    yield put({ type: types.REMOVE_ACCESS_TO_CLIENT_SUCCESS, payload: data });
    const notificationOpts = {
      message: 'Access to client removed successfully',
      position: 'tc',
      autoDismiss: 5,
    };
    yield put(success(notificationOpts));
    yield put({ type: types.GA_CLIENTS_GET });
  } catch (err) {
    yield put({ type: types.REMOVE_ACCESS_TO_CLIENT_ERROR, payload: err });
    yield put({ type: types.GA_CLIENTS_GET });
  }
}


export function* watchFetchData() {
  yield takeLatest(types.GA_CLIENTS_GET, getGaClients);
  yield takeLatest(types.REMOVE_ACCESS_TO_CLIENT, removeAccessToClient);
}

// All sagas to be loaded
export default [
  watchFetchData,
];


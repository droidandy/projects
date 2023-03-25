import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';

export function* getCarriers() {
  const url = `${BENREVO_API_PATH}/admin/carriers/all/`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.LOAD_CARRIERS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.LOAD_CARRIERS_ERROR, payload: err });
  }
}

export function* getBrokers() {
  const url = `${BENREVO_API_PATH}/admin/brokers/all/`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.LOAD_BROKERS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.LOAD_BROKERS_ERROR, payload: err });
  }
}

export function* getClients(action) {
  const brokerId = action.payload;
  try {
    const url = `${BENREVO_API_PATH}/admin/brokers/${brokerId}/clients/`;
    const data = yield call(request, url);
    yield put({ type: types.LOAD_CLIENTS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.LOAD_CLIENTS_ERROR, payload: err });
  }
}

export function* getClientsByName(action) {
  const searchText = action.payload.searchText;
  try {
    const url = `${BENREVO_API_PATH}/admin/clients/${searchText}/search/`;
    const data = yield call(request, url);
    yield put({ type: types.LOAD_CLIENTS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.LOAD_CLIENTS_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.LOAD_CARRIERS, getCarriers);
  yield takeLatest(types.LOAD_BROKERS, getBrokers);
  yield takeLatest(types.LOAD_CLIENTS, getClients);
  yield takeLatest(types.GET_CLIENTS_BY_NAME, getClientsByName);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

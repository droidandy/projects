import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';

export function* getPersons() {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/persons/find?type=SALES`;
    const data = yield call(request, url, ops);

    yield put({ type: types.PERSONS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.PERSONS_GET_ERROR, payload: error });
  }
}

export function* getCarriers() {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/carriers/product/all`;
    const data = yield call(request, url, ops);

    yield put({ type: types.CARRIERS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CARRIERS_GET_ERROR, payload: error });
  }
}

export function* getBrokers() {
  const url = `${BENREVO_API_PATH}/admin/brokers/all/`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.BROKERS_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.BROKERS_GET_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.PERSONS_GET, getPersons);
  yield takeLatest(types.CARRIERS_GET, getCarriers);
  yield takeLatest(types.BROKERS_GET, getBrokers);
}

export default [
  watchFetchData,
];

import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';
import { selectFilters } from './selectors';
import { generateQueryFilter } from '../../utils/query';

export function* getClients() {
  const ops = {
    method: 'GET',
  };
  try {
    const filters = yield select(selectFilters);
    const url = `${BENREVO_API_PATH}/dashboard/clients/search${generateQueryFilter(filters)}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.CLIENTS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CLIENTS_GET_ERROR, payload: error });
  }
}

export function* getFilters(action) {
  let product = action.payload.product;
  const ops = {
    method: 'GET',
  };
  try {
    if (!product) {
      const filters = yield select(selectFilters);
      product = filters.product;
    }
    const url = `${BENREVO_API_PATH}/dashboard/clients/search/filters?product=${product}`;
    const data = yield call(request, url, ops);

    yield put({ type: types.FILTERS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.FILTERS_GET_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.FILTERS_GET, getFilters);
  yield takeLatest(types.CLIENTS_GET, getClients);
}

export default [
  watchFetchData,
];

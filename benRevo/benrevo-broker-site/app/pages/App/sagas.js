import { call, put, takeEvery } from 'redux-saga/effects';
import { request } from '@benrevo/benrevo-react-core';
import { BENREVO_API_PATH } from './../../config';
import * as types from './constants';

export function* getAllCarriers() {
  try {
    const ops = {
      method: 'GET',
    };
    const keys = ['medical', 'dental', 'vision', 'life', 'vol_life', 'std', 'vol_std', 'ltd', 'vol_ltd'];
    for (let i = 0; i < keys.length; i += 1) {
      ops.headers = new Headers();
      ops.headers.append('content-type', 'application/json;charset=UTF-8');
      const data = yield call(request, `${BENREVO_API_PATH}/v1/rfpcarriers/?category=${keys[i]}`, ops);
      yield put({ type: types.GET_ALL_CARRIERS_SUCCESS, payload: data, meta: { section: keys[i] } });
    }
  } catch (error) {
    yield put({ type: types.GET_ALL_CARRIERS_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(types.GET_ALL_CARRIERS, getAllCarriers);
}

export default [
  watchFetchData,
];

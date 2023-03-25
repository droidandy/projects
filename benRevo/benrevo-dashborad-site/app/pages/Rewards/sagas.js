import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from './constants';
import { BENREVO_API_PATH } from '../../config';
import request from '../../utils/request';

export function* getRewards() {
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/dashboard/clients/rewards`;
    const data = yield call(request, url, ops);

    yield put({ type: types.REWARDS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.REWARDS_GET_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.REWARDS_GET, getRewards);
}

export default [
  watchFetchData,
];

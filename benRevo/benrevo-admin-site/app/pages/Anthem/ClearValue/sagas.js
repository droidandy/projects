import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { BENREVO_API_PATH } from '../../../config';
import * as types from './constants';
import { selectClearValue } from './selectors';


export function* clearValueCalculate() {
  try {
    const data = yield select(selectClearValue());
    const ops = {
      method: 'POST',
    };
    ops.body = JSON.stringify(data);

    const result = yield call(request, `${BENREVO_API_PATH}/admin/anthem/calculate/`, ops);

    yield put({ type: types.CLEAR_VALUE_CALCULATE_SUCCESS, payload: result });
  } catch (err) {
    yield put({ type: types.CLEAR_VALUE_CALCULATE_ERROR });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.CLEAR_VALUE_CALCULATE, clearValueCalculate);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

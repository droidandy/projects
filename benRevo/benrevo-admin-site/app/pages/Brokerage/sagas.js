import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from 'utils/request';
import { BENREVO_API_PATH } from '../../config';
import * as types from './constants';
import { selectChanges } from './selectors';
import { getBrokers } from '../Client/sagas';

export function* saveBrokerage() {
  try {
    const brokerage = yield select(selectChanges);
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify(brokerage);
    const data = yield call(request, `${BENREVO_API_PATH}/admin/brokers/update`, ops, false, 'Brokerage successfully updated.');
    yield call(getBrokers);
    yield put({ type: types.SAVE_CHANGES_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.SAVE_CHANGES_ERROR, payload: err });
  }
}

export function* getAuth0List(action) {
  try {
    const ops = {
      method: 'GET',
    };
    const url = `${BENREVO_API_PATH}/admin/brokers/${action.payload}/users`;
    const data = yield call(request, url, ops);
    yield put({ type: types.GET_AUTH0_LIST_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GET_AUTH0_LIST_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.SAVE_CHANGES, saveBrokerage);
  yield takeLatest(types.GET_AUTH0_LIST, getAuth0List);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

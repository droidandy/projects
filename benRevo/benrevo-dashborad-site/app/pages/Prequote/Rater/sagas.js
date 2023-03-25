import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  selectClientRequest,
} from '@benrevo/benrevo-react-rfp';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import * as types from '../constants';
import { makeSelectMainCarrier } from '../../App/selectors';
import { getHistory } from '../actions';
import { selectRaterData } from '../selectors';

export function* getRaters() {
  const ops = {
    method: 'GET',
  };
  try {
    const mainCarrier = yield select(makeSelectMainCarrier);
    const url = `${BENREVO_API_PATH}/v1/persons/find/?type=RATER&carrierId=${mainCarrier.carrierId}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.RATERS_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.RATERS_GET_ERROR, payload: error });
  }
}

export function* fetchHistory() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/notifications/${client.id}/EMAIL/SENT_TO_RATER`;
    const data = yield call(request, url, ops);
    yield put({ type: types.HISTORY_GET_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.HISTORY_GET_ERROR, payload: error });
  }
}

export function* sendToRater() {
  try {
    const raterData = yield select(selectRaterData);
    const client = yield select(selectClientRequest());
    const ops = {
      method: 'POST',
    };
    ops.headers = new Headers();
    ops.headers.append('Accept', 'application/json');
    const form = new FormData();
    form.append('personId', raterData.selectedRater);
    form.append('note', raterData.note);
    ops.body = form;
    const result = yield call(request, `${BENREVO_API_PATH}/dashboard/clients/${client.id}/email/optimizer`, ops, true);
    yield put({ type: types.SEND_TO_RATER_SUCCESS, payload: result });
    yield put(getHistory());
  } catch (error) {
    yield put({ type: types.SEND_TO_RATER_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.RATERS_GET, getRaters);
  yield takeLatest(types.HISTORY_GET, fetchHistory);
  yield takeLatest(types.SEND_TO_RATER, sendToRater);
}

export default [
  watchFetchData,
];

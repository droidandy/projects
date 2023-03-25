import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
  DISCLOSURE_SUBMIT,
  DISCLOSURE_SUBMIT_SUCCESS,
  DISCLOSURE_SUBMIT_ERROR,
  GET_CONFIG,
  GET_CONFIG_SUCCESS,
  GET_CONFIG_ERROR,
} from './constants';
import { BENREVO_API_PATH } from '../../config';
import { makeSelectDisclosure } from './selectors';
import request from '../../utils/request';

export function* getConfig(action) {
  let type = 'LANGUAGE';
  if (action && action.payload === 'CARRIER_EMAILS') {
    type = 'CARRIER_EMAILS';
  }
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/config?type=${type}`;
    const data = yield call(request, url, ops);

    yield put({ type: GET_CONFIG_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_CONFIG_ERROR, payload: error });
  }
}

export function* disclosureSubmit(action) {
  // [{"type": "LANGUAGE", "data": "html page"}])
  // [{"type": "CARRIER_EMAILS", "data": "json array of email params, see below"}]
  // [{"carrierId":1, "emails":["email@1","email@2","email@3"]},{"carrierId":2, "emails":["email@4"]},{"carrierId":3, "emails":[]}]
  let disclosure = null;
  let currentType = 'LANGUAGE';
  const ops = {
    method: 'PUT',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/brokers/config`;
    if (action && action.payload) {
      currentType = action.payload.type;
      disclosure = action.payload.data;
    } else {
      disclosure = yield select(makeSelectDisclosure());
    }
    ops.body = JSON.stringify([{
      data: disclosure,
      type: currentType,
    }]);

    const data = yield call(request, url, ops);

    yield put({ type: DISCLOSURE_SUBMIT_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: DISCLOSURE_SUBMIT_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(GET_CONFIG, getConfig);
  yield takeLatest(DISCLOSURE_SUBMIT, disclosureSubmit);
}

export default [
  watchFetchData,
];

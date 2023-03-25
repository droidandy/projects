import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { updateClient, CLIENT_STATE, QUOTED_NORMAL, RFP_SUBMITTED_NORMAL } from '@benrevo/benrevo-react-clients';
import {
  selectClientRequest,
  selectRfpSelected,
  selectRfp,
  getAllCarriers,
  saveRfp,
  getRfp,
  uploadFile,
  removeFile,
  getPdf,
  checkCensusType,
  saveRfpPlans,
  getPlanNetworks,
  SEND_RFP, SEND_RFP_TO_CARRIER_ERROR,
  FETCH_RFP, RFP_SUBMIT, RFP_SUBMITTED_SUCCESS,
  SEND_RFP_FILE,
  FETCH_RFP_PDF, CHANGE_CURRENT_CARRIER,
  CHECK_CENSUS_TYPE,
  REMOVE_FILE, REMOVE_PLAN_FILE,
  FETCH_CARRIERS,
  RFP_PLANS_SAVE,
  GET_RFP_STATUS, GET_RFP_STATUS_SUCCESS, GET_RFP_STATUS_ERROR,
} from '@benrevo/benrevo-react-rfp';

export function* submitRfpToCarrier() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const rfpIds = yield select(selectRfpSelected());
    if (!client.id) throw new Error('No Client Id found'); // todo ford handle this better.
    const submitUrl = `${BENREVO_API_PATH}/v1/clients/${client.id}/rfps/submit/?rfpIds=${rfpIds.join(',')}`;
    ops.headers = new Headers();
    let response = [];
    const rfpSubmission = yield call(request, submitUrl, ops);
    response = response.concat(rfpSubmission);
    const clearValueUrl = `${BENREVO_API_PATH}/v1/instantQuote/client/${client.id}/generate?rfpIds=${rfpIds.join(',')}`;
    ops.headers = new Headers();
    const clearValueSubmission = yield call(request, clearValueUrl, ops);
    response.push(clearValueSubmission);

    yield put({ type: RFP_SUBMITTED_SUCCESS, payload: response });
    yield put({ type: CHECK_CENSUS_TYPE, payload: null });

    let found = false;

    for (let i = 0; i < response.length; i += 1) {
      const item = response[i];
      if (item.type === 'CLEAR_VALUE' && item.rfpSubmittedSuccessfully) {
        yield put(updateClient(CLIENT_STATE, QUOTED_NORMAL));
        found = true;
      }
    }

    if (!found) yield put(updateClient(CLIENT_STATE, RFP_SUBMITTED_NORMAL));
  } catch (error) {
    yield put({ type: SEND_RFP_TO_CARRIER_ERROR, payload: error });
  }
}

export function* getStatus() {
  try {
    let ops;
    const data = yield select(selectRfp());
    const rfpIds = yield select(selectRfpSelected());

    ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const standard = yield call(request, `${BENREVO_API_PATH}/v1/clients/${data.client.get('id')}/rfp/status?rfpIds=${rfpIds.join(',')}`, ops);
    ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const cv = yield call(request, `${BENREVO_API_PATH}/v1/instantQuote/qualification/${data.client.get('id')}/?rfpIds=${rfpIds.join(',')}`, ops);

    yield put({ type: GET_RFP_STATUS_SUCCESS, payload: { data: standard, clearValue: cv, carrierName: 'ANTHEM_BLUE_CROSS' } });
  } catch (error) {
    yield put({ type: GET_RFP_STATUS_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(RFP_SUBMIT, submitRfpToCarrier);
  yield takeLatest(FETCH_CARRIERS, getAllCarriers);
  yield takeLatest(SEND_RFP, saveRfp);
  yield takeLatest(FETCH_RFP, getRfp);
  yield takeLatest(SEND_RFP_FILE, uploadFile);
  yield takeLatest(REMOVE_FILE, removeFile);
  yield takeLatest(REMOVE_PLAN_FILE, removeFile);
  yield takeEvery(FETCH_RFP_PDF, getPdf);
  yield takeEvery(CHECK_CENSUS_TYPE, checkCensusType);
  yield takeEvery(RFP_PLANS_SAVE, saveRfpPlans);
  yield takeEvery(CHANGE_CURRENT_CARRIER, getPlanNetworks);
  yield takeEvery(GET_RFP_STATUS, getStatus);
}

export default [
  watchFetchData,
];

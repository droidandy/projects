import { put, takeLatest, select, call } from 'redux-saga/effects';
import { getOptions } from '@benrevo/benrevo-react-quote';
import { request } from '@benrevo/benrevo-react-core';
import { BENREVO_API_PATH } from './../../config';
import { changeLoad, getAnotherOptions } from './actions';
import * as types from './constants';
import { selectClient } from './selectors';

export function* getAnotherOptionsSaga(action) {
  const client = yield select(selectClient());
  const { section } = action.meta;
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/ancillaryOptions/?clientId=${client.id}&category=${section.toUpperCase()}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.OPTIONS_GET_SUCCESS, payload: data, meta: { section } });
    yield put(changeLoad(section, { options: false }));
  } catch (error) {
    yield put({ type: types.OPTIONS_GET_ERROR, payload: error, meta: { section } });
    yield put(changeLoad(section, { options: false }));
  }
}


export function* initOptions(action) {
  try {
    const { section } = action.meta;
    const ops = {
      method: 'POST',
    };
    const client = yield select(selectClient());
    ops.body = JSON.stringify({ clientId: client.id, product: section.toUpperCase() });
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/initOptions`, ops);
    yield put({ type: types.INIT_OPTIONS_SUCCESS, payload: data, meta: { section } });

    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      yield put(getAnotherOptions(section));
    } else if (section === 'medical' || section === 'dental' || section === 'vision') {
      yield put(getOptions(section));
    }
  } catch (error) {
    yield put({ type: types.INIT_OPTIONS_ERROR, payload: error });
  }
}

export function* getMedicalGroups() {
  const url = `${BENREVO_API_PATH}/v1/medical-groups/carriers`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.COMPARISON_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.COMPARISON_GET_ERROR, payload: err });
  }
}

export function* getDisclaimer(action) {
  const product = action.payload.rfpQuoteOption.toUpperCase();
  const client = yield select(selectClient());
  const url = `${BENREVO_API_PATH}/broker/presentation/disclosures?clientId=${client.id}&product=${product}`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.GET_DISCLAIMERS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.GET_DISCLAIMERS_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.COMPARISON_GET, getMedicalGroups);
  yield takeLatest(types.GET_ANOTHER_OPTIONS, getAnotherOptionsSaga);
  yield takeLatest(types.INIT_OPTIONS, initOptions);
  yield takeLatest(types.GET_DISCLAIMERS_DATA, getDisclaimer);
}

export default [
  watchFetchData,
];

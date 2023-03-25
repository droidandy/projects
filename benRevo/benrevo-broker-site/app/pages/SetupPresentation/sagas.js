import { call, put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { request } from '@benrevo/benrevo-react-core';
import { selectCurrentClient } from '@benrevo/benrevo-react-clients';
import { BENREVO_API_PATH } from './../../config';
import * as types from './constants';
import { selectNewAlternative, selectDiscounts } from './selectors';

export function* getOptions() {
  try {
    const ops = {
      method: 'GET',
    };
    const client = yield select(selectCurrentClient());
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/${client.id}/presentationOption`, ops);

    yield put({ type: types.GET_PRESENTATION_OPTIONS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_PRESENTATION_OPTIONS_ERROR, payload: error });
  }
}

export function* getOptionsRequest(action) {
  const { section } = action.payload;
  try {
    const client = yield select(selectCurrentClient());

    let url = '';

    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      url = `${BENREVO_API_PATH}/v1/quotes/ancillaryOptions/?clientId=${client.id}&category=${section.toUpperCase()}`;
    } else if (section === 'medical' || section === 'dental' || section === 'vision') {
      url = `${BENREVO_API_PATH}/v1/quotes/options/?clientId=${client.id}&category=${section.toUpperCase()}`;
    }

    const data = yield call(request, url);
    yield put({ type: types.GET_OPTIONS_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: types.GET_OPTIONS_ERROR, payload: err, meta: { section } });
  }
}

export function* createAlternative() {
  try {
    const ops = {
      method: 'POST',
    };
    const client = yield select(selectCurrentClient());
    const alternative = yield select(selectNewAlternative());
    ops.body = JSON.stringify(alternative);
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/${client.id}/alternativeColumn/create`, ops);

    yield put({ type: types.CREATE_ALTERNATIVE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.CREATE_ALTERNATIVE_ERROR, payload: error });
  }
}

export function* deleteAlternative(action) {
  const { presentationOptionId } = action.payload;

  try {
    const ops = {
      method: 'DELETE',
    };
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/presentationOption/${presentationOptionId}`, ops);

    yield put({ type: types.DELETE_ALTERNATIVE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.DELETE_ALTERNATIVE_ERROR, payload: error });
  }
}

export function* deleteAlternativeOption(action) {
  const { product, presentationOptionId, rfpQuoteOptionId } = action.payload;

  try {
    const ops = {
      method: 'DELETE',
    };
    ops.body = JSON.stringify({
      presentationOptionId,
      product: product.toUpperCase(),
      rfpQuoteOptionId,
    });
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/presentationOption`, ops);

    yield put({ type: types.DELETE_ALTERNATIVE_OPTION_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.DELETE_ALTERNATIVE_OPTION_ERROR, payload: error });
  }
}

export function* updateAlternativeOption(action) {
  const { product, presentationOptionId, rfpQuoteOptionId } = action.payload;
  try {
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify({
      presentationOptionId,
      product: product.toUpperCase(),
      rfpQuoteOptionId,
    });
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/presentationOption`, ops);

    yield put({ type: types.UPDATE_ALTERNATIVE_OPTION_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.UPDATE_ALTERNATIVE_OPTION_ERROR, payload: error });
  }
}

export function* updateDiscount(action) {
  const {
    index,
  } = action.payload;
  try {
    const ops = {
      method: 'PUT',
    };
    const discounts = yield select(selectDiscounts(index));
    if (discounts.send) {
      ops.body = JSON.stringify(discounts.data);
      const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/presentationOption`, ops);

      yield put({ type: types.UPDATE_DISCOUNT_SUCCESS, payload: data });
    }
  } catch (error) {
    yield put({ type: types.UPDATE_DISCOUNT_ERROR, payload: error });
  }
}

export function* downloadFile(action) {
  try {
    const { clientId, type } = action.payload;
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    let contentType = '';
    let name = '';
    if (type === 'powerPoint') {
      contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      name = 'presentation.pptx';
    } else {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      name = 'financialTables.exel';
    }
    ops.headers.append('content-type', contentType);
    const data = yield call(request, `${BENREVO_API_PATH}/broker/presentation/file/${type}?clientId=${clientId}`, ops, true);
    const blob = new Blob([data], {
      type: contentType,
    });
    const link = document.createElement('a');
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, name);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', name);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
    yield put({ type: types.DOWNLOAD_PRESENTATION_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.DOWNLOAD_PRESENTATION_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(types.GET_OPTIONS, getOptionsRequest);
  yield takeLatest(types.GET_PRESENTATION_OPTIONS, getOptions);
  yield takeLatest(types.CREATE_ALTERNATIVE, createAlternative);
  yield takeLatest(types.UPDATE_ALTERNATIVE_OPTION, updateAlternativeOption);
  yield takeLatest(types.DELETE_ALTERNATIVE, deleteAlternative);
  yield takeLatest(types.DELETE_ALTERNATIVE_OPTION, deleteAlternativeOption);
  yield takeEvery(types.UPDATE_DISCOUNT, updateDiscount);
  yield takeEvery(types.REMOVE_DISCOUNT, updateDiscount);
  yield takeLatest(types.DOWNLOAD_PRESENTATION, downloadFile);
}

export default [
  watchFetchData,
];

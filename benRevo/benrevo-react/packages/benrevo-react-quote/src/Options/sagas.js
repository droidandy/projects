import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { saveClient } from '@benrevo/benrevo-react-clients';
import {
  COMPARE_GET,
  COMPARE_GET_SUCCESS,
  COMPARE_GET_ERROR,
  OPTIONS_GET,
  OPTIONS_GET_SUCCESS,
  OPTIONS_GET_ERROR,
  OPTIONS_SELECT,
  OPTIONS_SELECT_SUCCESS,
  OPTIONS_SELECT_ERROR,
  OPTIONS_UNSELECT,
  OPTIONS_UNSELECT_SUCCESS,
  OPTIONS_UNSELECT_ERROR,
  OPTIONS_DELETE,
  OPTIONS_DELETE_SUCCESS,
  OPTIONS_DELETE_ERROR,
  COMPARE_FILE,
  COMPARE_FILE_SUCCESS,
  COMPARE_FILE_ERROR,
  DOWNLOAD_QUOTE,
  DOWNLOAD_QUOTE_SUCCESS,
  DOWNLOAD_QUOTE_ERROR,
  CREATE_DTP_CLEAR_VALUE,
  CREATE_DTP_CLEAR_VALUE_SUCCESS,
  CREATE_DTP_CLEAR_VALUE_ERROR,
  GET_CLEAR_VALUE_STATUS,
  GET_CLEAR_VALUE_STATUS_SUCCESS,
  GET_CLEAR_VALUE_STATUS_ERROR,
  DOWNLOAD_PPT,
  DOWNLOAD_PPT_SUCCESS,
  DOWNLOAD_PPT_ERROR,
} from '../constants';
import { selectClient, selectCompare, selectCarrier, selectQuotes } from '../selectors';
import { getFinal, changeLoad, getOptions, getQuotesStatus } from '../actions';

export function* getCompareData(action) {
  const section = action.meta.section;
  let currentOptionCompare = false;

  try {
    const ids = yield select(selectCompare(section));
    const finalIds = [];

    ids.map((item) => {
      if (item === 'current') currentOptionCompare = true;
      else finalIds.push(item);

      return true;
    });

    let url = `${BENREVO_API_PATH}/v1/quotes/options/compare/?ids=${finalIds.join(',')}`;

    if (currentOptionCompare) url += '&currentOptionCompare=true';

    const data = yield call(request, url);
    yield put({ type: COMPARE_GET_SUCCESS, payload: data, meta: { section } });
    yield put(changeLoad(section, { compare: false }));
  } catch (err) {
    yield put({ type: COMPARE_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* compareFile(action) {
  const section = action.meta.section;
  let currentOptionCompare = false;
  const ops = {
    method: 'GET',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  try {
    const ids = yield select(selectCompare(section));
    const finalIds = [];

    ids.map((item) => {
      if (item === 'current') currentOptionCompare = true;
      else finalIds.push(item);

      return true;
    });

    let url = `${BENREVO_API_PATH}/v1/quotes/options/compare/file?ids=${finalIds.join(',')}`;

    if (currentOptionCompare) url += '&currentOptionCompare=true';

    const data = yield call(request, url, ops, true);
    const link = document.createElement('a');
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, 'quoteOptionComparison.xlsx');
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', 'quoteOptionComparison.xlsx');
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
    yield put({ type: COMPARE_FILE_SUCCESS, meta: { section } });
  } catch (err) {
    yield put({ type: COMPARE_FILE_ERROR, payload: err, meta: { section } });
  }
}

export function* quoteFile(action) {
  const section = action.meta.section;
  const kaiser = action.payload.kaiser;
  const ops = {
    method: 'GET',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  try {
    const mainCarrier = yield select(selectCarrier(section));
    const quotes = yield select(selectQuotes(section));
    let rfpQuoteId;

    for (let i = 0; i < quotes.length; i += 1) {
      const item = quotes[i];

      if (item.rfpCarrierId === mainCarrier.rfpCarrierId) {
        if ((kaiser && (item.quoteType === 'KAISER' || item.quoteType === 'KAISER_EASY')) || (!kaiser && (item.quoteType === 'STANDARD' || item.quoteType === 'EASY'))) {
          rfpQuoteId = item.rfpQuoteId;
          break;
        }
      }
    }

    if (rfpQuoteId) {
      const url = `${BENREVO_API_PATH}/v1/quotes/${rfpQuoteId}/file`;

      const data = yield call(request, url, ops, true);
      let filename = data.filename;

      if (!filename && !kaiser) filename = `quote-${section}.xls`;
      else if (!filename) filename = `quote-${section}-with-kaiser.xls`;

      const blob = new Blob([data], {
        type: 'application/vnd.ms-excel',
      });
      const link = document.createElement('a');

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        link.setAttribute('href', window.URL.createObjectURL(blob));
        link.setAttribute('download', filename);
        if (document.createEvent) {
          const event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          link.dispatchEvent(event);
        } else {
          link.click();
        }
      }

      yield put({ type: DOWNLOAD_QUOTE_SUCCESS, meta: { section } });
    }
  } catch (err) {
    yield put({ type: DOWNLOAD_QUOTE_ERROR, payload: err, meta: { section } });
  }
}

export function* getOptionsRequest(action) {
  const section = action.meta.section;
  try {
    const client = yield select(selectClient());

    const url = `${BENREVO_API_PATH}/v1/quotes/options/?clientId=${client.id}&category=${section.toUpperCase()}`;

    const data = yield call(request, url);
    yield put({ type: OPTIONS_GET_SUCCESS, payload: data, meta: { section } });
    yield put(changeLoad(section, { options: false }));
  } catch (err) {
    yield put({ type: OPTIONS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* optionsSelect(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const ops = {
    method: 'PUT',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/select`;

    yield call(request, url, ops);
    yield put({ type: OPTIONS_SELECT_SUCCESS, payload: { id: optionId }, meta: { section } });
    yield put(getFinal());
    yield put(changeLoad(section, { overview: true }));
    yield put(changeLoad('medical', { options: true, overview: true }));
  } catch (err) {
    yield put({ type: OPTIONS_SELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* optionsUnSelect(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const ops = {
    method: 'PUT',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${optionId}/unselect`;

    yield call(request, url, ops);
    yield put({ type: OPTIONS_UNSELECT_SUCCESS, payload: { id: optionId }, meta: { section } });

    yield put(getFinal());
    yield put(changeLoad(section, { overview: true }));
    yield put(changeLoad('medical', { options: true, overview: true }));
  } catch (err) {
    yield put({ type: OPTIONS_UNSELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* optionsDelete(action) {
  const section = action.meta.section;
  const optionId = action.payload.optionId;
  const ops = {
    method: 'DELETE',
  };
  try {
    let url = `${BENREVO_API_PATH}/v1/quotes/options/delete`;
    if (section !== 'medical' && section !== 'dental' && section !== 'vision') {
      url = `${BENREVO_API_PATH}/v1/quotes/options/ancillary/delete`;
      ops.body = JSON.stringify({
        rfpQuoteAncillaryOptionId: optionId,
      });
    } else {
      ops.body = JSON.stringify({
        rfpQuoteOptionId: optionId,
      });
    }
    yield call(request, url, ops);
    yield put({ type: OPTIONS_DELETE_SUCCESS, payload: { id: optionId }, meta: { section } });

    yield put(getFinal());
    yield put(changeLoad('medical', { options: true, overview: true }));
  } catch (err) {
    yield put({ type: OPTIONS_DELETE_ERROR, payload: err, meta: { section } });
  }
}

export function* createDTPClearValue() {
  const client = yield select(selectClient());
  const ops = {
    method: 'POST',
  };
  try {
    yield saveClient();
    const url = `${BENREVO_API_PATH}/v1/instantQuote/client/${client.id}/generate`;
    const data = yield call(request, url, ops);

    if (data.rfpSubmittedSuccessfully) {
      yield put(getQuotesStatus('medical'));
      yield put(getQuotesStatus('dental'));
      yield put(getQuotesStatus('vision'));
      yield put(getOptions('medical'));
      yield put(getOptions('dental'));
      yield put(getOptions('vision'));
    }

    yield put({ type: CREATE_DTP_CLEAR_VALUE_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: CREATE_DTP_CLEAR_VALUE_ERROR, payload: err });
  }
}

export function* getDTPClearValueStatus() {
  const client = yield select(selectClient());
  const ops = {
    method: 'GET',
  };
  try {
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const status = yield call(request, `${BENREVO_API_PATH}/v1/clients/${client.id}/rfp/status`, ops);
    ops.headers = new Headers();
    const cv = yield call(request, `${BENREVO_API_PATH}/v1/instantQuote/qualification/${client.id}`, ops);
    let response = {};

    for (let i = 0; i < status.length; i += 1) {
      if (status[i].type === 'CLEAR_VALUE') response = cv;
    }

    yield put({ type: GET_CLEAR_VALUE_STATUS_SUCCESS, payload: response });
  } catch (err) {
    yield put({ type: GET_CLEAR_VALUE_STATUS_ERROR, payload: err });
  }
}

export function* downloadPPT() {
  try {
    const ops = {
      method: 'GET',
    };
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/presentation/file/powerPoint/?clientId=${client.id}`;
    const data = yield call(request, url, ops, true);
    const filename = 'presentation.pptx';
    const link = document.createElement('a');
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
    yield put({ type: DOWNLOAD_PPT_SUCCESS });
  } catch (err) {
    yield put({ type: DOWNLOAD_PPT_ERROR, payload: err });
  }
}

export function* watchFetchData() {
  yield takeLatest(COMPARE_GET, getCompareData);
  yield takeLatest(COMPARE_FILE, compareFile);
  yield takeEvery(OPTIONS_GET, getOptionsRequest);
  yield takeLatest(OPTIONS_SELECT, optionsSelect);
  yield takeLatest(OPTIONS_UNSELECT, optionsUnSelect);
  yield takeLatest(OPTIONS_DELETE, optionsDelete);
  yield takeLatest(DOWNLOAD_QUOTE, quoteFile);
  yield takeLatest(CREATE_DTP_CLEAR_VALUE, createDTPClearValue);
  yield takeLatest(GET_CLEAR_VALUE_STATUS, getDTPClearValueStatus);
  yield takeLatest(DOWNLOAD_PPT, downloadPPT);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

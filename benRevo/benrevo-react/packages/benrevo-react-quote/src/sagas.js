import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { info } from 'react-notification-system-redux';
import { updateClient, CLIENT_STATE, PENDING_APPROVAL } from '@benrevo/benrevo-react-clients';
import {
  SEND_INVITE_CLIENT,
  SEND_INVITE_CLIENT_SUCCESS,
  SEND_INVITE_CLIENT_ERROR,
  QUOTE_GET,
  QUOTE_GET_SUCCESS,
  QUOTE_GET_ERROR,
  QUOTES_GET,
  QUOTES_GET_SUCCESS,
  QUOTES_GET_ERROR,
  QUOTES_GET_RESET,
  ADD_QUOTE,
  ADD_QUOTE_SUCCESS,
  ADD_QUOTE_ERROR,
  UPDATE_QUOTE,
  UPDATE_QUOTE_SUCCESS,
  UPDATE_QUOTE_ERROR,
  DELETE_QUOTE,
  DELETE_QUOTE_SUCCESS,
  DELETE_QUOTE_ERROR,
  SELECTED_GET,
  SELECTED_GET_SUCCESS,
  SELECTED_GET_ERROR,
  SUBMIT_FINAL_SECTIONS_SUCCESS,
  SUBMIT_FINAL_SECTIONS_ERROR,
  SUBMIT_FINAL_SECTIONS,
  CARRIERS_GET,
  CARRIERS_GET_SUCCESS,
  CARRIERS_GET_ERROR,
  COMPARISON_GET,
  COMPARISON_GET_SUCCESS,
  COMPARISON_GET_ERROR,
  DISCLAIMER_GET,
  DISCLAIMER_GET_SUCCESS,
  DISCLAIMER_GET_ERROR,
  GET_QUOTES_CATEGORY,
  GET_QUOTES_CATEGORY_SUCCESS,
  GET_QUOTES_CATEGORY_ERROR,
  QUOTES_STATUS_GET,
  QUOTES_STATUS_GET_SUCCESS,
  QUOTES_STATUS_GET_ERROR,
  EXTERNAL_PRODUCTS_SELECT,
  EXTERNAL_PRODUCTS_SELECT_SUCCESS,
  EXTERNAL_PRODUCTS_SELECT_ERROR,
  DOWNLOAD_PLAN_BENEFITS_SUMMARY,
  DOWNLOAD_PLAN_BENEFITS_SUMMARY_SUCCESS,
  DOWNLOAD_PLAN_BENEFITS_SUMMARY_ERROR,
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_ERROR,
  GET_FILE,
  GET_FILE_SUCCESS,
  GET_FILE_ERROR,
  LIFE,
  STD,
  LTD,
  SUPP_LIFE,
  STD_LTD,
  HEALTH,
  DOWNLOAD_LIFE_QUOTE,
  DOWNLOAD_LIFE_QUOTE_SUCCESS,
  DOWNLOAD_LIFE_QUOTE_ERROR,
  ADD_OPTION_NEW_PRODUCTS,
  ADD_OPTION_NEW_PRODUCTS_SUCCESS,
  ADD_OPTION_NEW_PRODUCTS_ERROR,
  DOWNLOAD_MOD_LETTER,
  DOWNLOAD_MOD_LETTER_SUCCESS,
  DOWNLOAD_MOD_LETTER_ERROR,
} from './constants';
import { selectClient, selectCarrierList } from './selectors';
import { getFinal, changeLoad } from './actions';

export function* getSelected() {
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selected/?clientId=${client.id}`;
    const data = yield call(request, url);
    yield put({ type: SELECTED_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: SELECTED_GET_ERROR, payload: err });
  }
}

export function* inviteClient(action) {
  const email = action.email;
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClient());

    const url = `${BENREVO_API_PATH}/v1/accounts/clients/${client.id}`;
    ops.body = JSON.stringify({
      email,
    });
    const data = yield call(request, url, ops);

    yield put({ type: SEND_INVITE_CLIENT_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: SEND_INVITE_CLIENT_ERROR, payload: err });
  }
}

export function* getQuotesCategory(action) {
  const section = action.meta.section;
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/quotes/?category=${section}`;
    const data = yield call(request, url);
    yield put({ type: GET_QUOTES_CATEGORY_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    if (err) {
      yield put({ type: GET_QUOTES_CATEGORY_ERROR, payload: err, meta: { section } });
    }
  }
}

export function* getQuotes(action) {
  const client = yield select(selectClient());
  const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/quotes/summary`;
  const url2 = `${BENREVO_API_PATH}/v1/clients/${client.id}/quotes/?category=life`;
  const section = action.meta.section;
  try {
    const data = yield call(request, url);
    const life = yield call(request, url2);
    yield put({ type: QUOTES_GET_SUCCESS, payload: { data, life }, meta: { section } });
  } catch (err) {
    if (err.toString().indexOf('404') === -1) {
      yield put({ type: QUOTES_GET_ERROR, payload: err, meta: { section } });
    } else {
      yield put({ type: QUOTES_GET_RESET });
    }
  }
}

export function* getQuotesStatus(action) {
  const section = action.meta.section;
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/quotes/status?clientId=${client.id}&category=${section.toUpperCase()}`;
    const data = yield call(request, url);
    yield put({ type: QUOTES_STATUS_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: QUOTES_STATUS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getCarriers(action) {
  const carriers = yield select(selectCarrierList());
  try {
    for (let i = 0; i < Object.keys(carriers).length; i += 1) {
      const key = Object.keys(carriers)[i];

      if (!carriers[key].length || action.payload.force) {
        const url = `${BENREVO_API_PATH}/v1/rfpcarriers/?category=${key}`;
        const data = yield call(request, url);
        yield put({ type: CARRIERS_GET_SUCCESS, payload: data, meta: { section: key } });
      }
    }
  } catch (err) {
    yield put({ type: CARRIERS_GET_ERROR, payload: err });
  }
}

export function* getQuote(action) {
  const quoteId = action.quoteId;
  const url = `${BENREVO_API_PATH}/v1/presentation/quote/${quoteId}`;
  try {
    const data = yield call(request, url);
    yield put({ type: QUOTE_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: QUOTE_GET_ERROR, payload: err });
  }
}

export function* addQuote(action) {
  const url = `${BENREVO_API_PATH}/v1/presentation/quote`;
  const quote = action.quote;
  const ops = {
    method: 'POST',
  };
  try {
    ops.body = JSON.stringify({
      quote,
    });
    const data = yield call(request, url, ops);
    yield put({ type: ADD_QUOTE_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: ADD_QUOTE_ERROR, payload: err });
  }
}

export function* updateQuote(action) {
  const quote = action.quote;
  const url = `${BENREVO_API_PATH}/v1/presentation/quote/${quote.id}`;
  const ops = {
    method: 'PUT',
  };
  try {
    ops.body = JSON.stringify({
      quote,
    });
    const data = yield call(request, url, ops);
    yield put({ type: UPDATE_QUOTE_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: UPDATE_QUOTE_ERROR, payload: err });
  }
}

export function* deleteQuote(action) {
  const quoteId = action.quoteId;
  const url = `${BENREVO_API_PATH}/v1/presentation/quote/${quoteId}`;
  const ops = {
    method: 'DELETE',
  };
  try {
    const data = yield call(request, url, ops);
    yield put({ type: DELETE_QUOTE_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: DELETE_QUOTE_ERROR, payload: err });
  }
}

export function* submitFinalSection() {
  const url = `${BENREVO_API_PATH}/v1/quotes/options/submit`;
  const state = yield select();
  const client = yield select(selectClient());
  const pres = state.get('presentation');
  const medSelected = pres.get('medical').get('selected');
  const denSelected = pres.get('dental').get('selected');
  const visSelected = pres.get('vision').get('selected');
  const body = {
    clientId: client.id,
    medicalQuoteOptionId: medSelected,
    dentalQuoteOptionId: denSelected,
    visionQuoteOptionId: visSelected,
  };

  const ops = {
    method: 'POST',
  };
  try {
    ops.body = JSON.stringify(body);
    const data = yield call(request, url, ops);
    yield put({ type: SUBMIT_FINAL_SECTIONS_SUCCESS, payload: data });
    if (data.errorMessage) {
      const notificationOpts = {
        message: data.errorMessage,
        position: 'tc',
        autoDismiss: 5,
      };
      yield put(info(notificationOpts));
    } else {
      yield put(updateClient(CLIENT_STATE, PENDING_APPROVAL));
    }
  } catch (err) {
    yield put({ type: SUBMIT_FINAL_SECTIONS_ERROR, payload: err });
  }
}

export function* getMedicalGroups() {
  const url = `${BENREVO_API_PATH}/v1/medical-groups`;
  try {
    const data = yield call(request, url);
    yield put({ type: COMPARISON_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: COMPARISON_GET_ERROR, payload: err });
  }
}

export function* getDisclaimer(action) {
  const section = action.meta.section;
  const rfpQuoteOptionId = action.payload.rfpQuoteOptionId;
  const url = `${BENREVO_API_PATH}/v1/quotes/options/${rfpQuoteOptionId}/disclaimer`;
  try {
    const data = yield call(request, url);
    yield put({ type: DISCLAIMER_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: DISCLAIMER_GET_ERROR, payload: err });
  }
}

export function* externalProductsSelect(action) {
  const type = action.payload.type;
  const value = action.payload.value;
  const client = yield select(selectClient());
  const state = yield select();
  const pres = state.get('presentation');
  const ops = {
    method: 'POST',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/extProducts`;

    const externalProducts = pres.get('final').get('externalProducts').toJS();
    const finalExternalProducts = [];

    if (externalProducts[LIFE] || (type === LIFE && value)) finalExternalProducts.push(LIFE);
    if (externalProducts[STD] || (type === STD && value)) finalExternalProducts.push(STD);
    if (externalProducts[LTD] || (type === LTD && value)) finalExternalProducts.push(LTD);
    if (externalProducts[SUPP_LIFE] || (type === SUPP_LIFE && value)) finalExternalProducts.push(SUPP_LIFE);
    if (externalProducts[STD_LTD] || (type === STD_LTD && value)) finalExternalProducts.push(STD_LTD);
    if (externalProducts[HEALTH] || (type === HEALTH && value)) finalExternalProducts.push(HEALTH);

    ops.body = JSON.stringify(finalExternalProducts);

    yield call(request, url, ops);
    yield put({ type: EXTERNAL_PRODUCTS_SELECT_SUCCESS, payload: action.payload });
    yield put(getFinal());
    yield put(changeLoad('medical', { options: true, overview: true }));
  } catch (err) {
    yield put({ type: EXTERNAL_PRODUCTS_SELECT_ERROR, payload: err });
  }
}

export function* downloadPlanBenefitsSummary(action) {
  const summaryFileLink = action.payload.summaryFileLink;
  const ops = {
    method: 'GET',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/pdf');
  try {
    const data = yield call(request, summaryFileLink, ops, true);
    let filename = data.filename;
    if (!filename) filename = `${action.payload.planName}.pdf`;
    const blob = new Blob([data], {
      type: 'application/pdf',
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
    yield put({ type: DOWNLOAD_PLAN_BENEFITS_SUMMARY_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: DOWNLOAD_PLAN_BENEFITS_SUMMARY_ERROR, payload: err });
  }
}

export function* getDocuments() {
  try {
    const url = `${BENREVO_API_PATH}/v1/documents/search?tag=Document Hub`;
    const data = yield call(request, url);
    yield put({ type: GET_DOCUMENTS_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: GET_DOCUMENTS_ERROR, payload: err });
  }
}

export function* getFile(action) {
  const item = action.payload;
  const ops = {
    method: 'GET',
  };
  try {
    const url = `${BENREVO_API_PATH}/v1/documents/${item.documentId}/download`;
    const data = yield call(request, url, ops, true);
    const filename = `${item.fileName}.${item.fileExtension}`;

    const blob = new Blob([data], {
      type: item.mimeType,
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

    yield put({ type: GET_FILE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: GET_FILE_ERROR, payload: error });
  }
}

export function* downloadLifeQuote(action) {
  // const url = `${BENREVO_API_PATH}/v1/quotes/{rfpQuoteId}/file`;
  const quotes = action.payload;
  try {
    let data = '';
    for (let i = 0; i <= quotes.length; i += 1) {
      const url = `${BENREVO_API_PATH}/v1/quotes/${quotes[i].rfpQuoteId}/file`;
      data = yield call(request, url);
    }
    const filename = data.filename;
    const blob = new Blob([data], {
      type: 'application/pdf',
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
    yield put({ type: DOWNLOAD_LIFE_QUOTE_SUCCESS });
  } catch (error) {
    yield put({ type: DOWNLOAD_LIFE_QUOTE_ERROR, payload: error });
  }
}

export function* addOptionForNewProductsSaga(action) {
  let url = '';
  let ops = {};
  const {
    optionType,
    id,
    carrier: {
      rfpCarrierId,
      carrier: {
        displayName,
      },
    },
  } = action.payload.option;
  const section = action.meta.section;
  try {
    const client = yield select(selectClient());
    if (id === 'new') {
      url = `${BENREVO_API_PATH}/v1/quotes/options/createAncillary`;
      ops = {
        method: 'POST',
      };
      ops.body = JSON.stringify({
        clientId: client.id,
        displayName,
        optionType,
        quoteType: 'STANDARD',
        rfpCarrierId,
      });
    } else {
      url = `${BENREVO_API_PATH}/v1/quotes/options/ancillary/${id}`;
      ops = {
        method: 'GET',
      };
    }
    const data = yield call(request, url, ops);
    const load = { overview: id === 'new' };

    if (id === 'new') load.options = true;

    yield put(changeLoad(section, load));
    yield put({ type: ADD_OPTION_NEW_PRODUCTS_SUCCESS, payload: { data }, meta: { section } });
  } catch (error) {
    yield put({ type: ADD_OPTION_NEW_PRODUCTS_ERROR, payload: error });
  }
}

export function* downloadModLetter() {
  try {
    const client = yield select(selectClient());
    const url = `${BENREVO_API_PATH}/v1/clients/${client.id}/quotes/summary/file`;
    const data = yield call(request, url);
    const blob = new Blob([data], {
      type: 'application/pdf',
    });
    const filename = data.filename;
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
    yield put({ type: DOWNLOAD_MOD_LETTER_SUCCESS });
  } catch (error) {
    yield put({ type: DOWNLOAD_MOD_LETTER_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeEvery(GET_QUOTES_CATEGORY, getQuotesCategory);
  yield takeLatest(QUOTE_GET, getQuote);
  yield takeLatest(QUOTES_GET, getQuotes);
  yield takeEvery(QUOTES_STATUS_GET, getQuotesStatus);
  yield takeLatest(CARRIERS_GET, getCarriers);
  yield takeLatest(ADD_QUOTE, addQuote);
  yield takeLatest(UPDATE_QUOTE, updateQuote);
  yield takeLatest(DELETE_QUOTE, deleteQuote);
  yield takeLatest(SEND_INVITE_CLIENT, inviteClient);
  yield takeLatest(SELECTED_GET, getSelected);
  yield takeLatest(SUBMIT_FINAL_SECTIONS, submitFinalSection);
  yield takeLatest(COMPARISON_GET, getMedicalGroups);
  yield takeLatest(DISCLAIMER_GET, getDisclaimer);
  yield takeLatest(EXTERNAL_PRODUCTS_SELECT, externalProductsSelect);
  yield takeLatest(DOWNLOAD_PLAN_BENEFITS_SUMMARY, downloadPlanBenefitsSummary);
  yield takeLatest(GET_DOCUMENTS, getDocuments);
  yield takeLatest(GET_FILE, getFile);
  yield takeLatest(DOWNLOAD_LIFE_QUOTE, downloadLifeQuote);
  yield takeLatest(ADD_OPTION_NEW_PRODUCTS, addOptionForNewProductsSaga);
  yield takeLatest(DOWNLOAD_MOD_LETTER, downloadModLetter);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

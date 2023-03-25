import { call, takeEvery, select, put } from 'redux-saga/effects';
import { selectClientRequest } from '@benrevo/benrevo-react-rfp';
import * as types from '../constants';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import {
    loadingQuote,
    receiveDownloadedQuotes,
    getDownloadedQuotes,
    openQuoteTypesModal,
    openUploadQuotesErrorsModal,
    closeQuoteTypesModal,
    setQuoteType,
} from './actions';
import { uploadQuoteSelector } from '../selectors';

export function* loadDownloadedQuotesSaga() {
  const ops = {
    method: 'GET',
  };
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/admin/history/rfpQuote/${client.id}/ANTHEM_BLUE_CROSS`;
    const downloadQuotes = yield call(request, url, ops);
    yield put(receiveDownloadedQuotes(downloadQuotes));
  } catch (error) {
    console.error(error);
  }
}

export function* validateQuoteSaga(action) {
  const file = action.payload.data[0];
  const ops = {
    method: 'POST',
  };
  ops.headers = new Headers();
  ops.headers.append('Accept', 'application/json');
  const form = new FormData();
  form.append('files', file);
  ops.body = form;
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}/validate`;
    yield put(loadingQuote(true));
    const validateQuote = yield call(request, url, ops, true);
    yield put(loadingQuote(false));
    if (validateQuote.errors.length) {
      yield put(openUploadQuotesErrorsModal(validateQuote.errors));
    } else {
      yield put(openQuoteTypesModal({ validateQuote, quoteType: action.payload.quoteType }));
      if (validateQuote.needsMedicalQuoteType) {
        yield put(setQuoteType('medical')); // set default value in state, when modal opened
      } else {
        yield put(setQuoteType('addDPPO'));
      }
    }
  } catch (error) {
    yield put(loadingQuote(false));
    console.error(error);
  }
}

export function* uploadQuoteSaga(action) {
  const fileToUpload = action.payload[0];
  const typeOfModal = action.quoteType;
  const uploadQuote = yield select(uploadQuoteSelector);
  const ops = {
    method: 'POST',
  };
  ops.headers = new Headers();
  ops.headers.append('Accept', 'application/json');

  const { standart, kaiser, quoteType } = uploadQuote;
  const validation = kaiser.validation || standart.validation || {};
  const { needsMedicalQuoteType, needsDPPOOption } = validation;
  const dto = {};
  if (needsMedicalQuoteType && quoteType === 'medical') {
    dto.medicalQuoteType = 'STANDARD';
  }
  if (needsMedicalQuoteType && quoteType === 'kaiser') {
    dto.medicalQuoteType = 'KAISER';
  }
  if (needsDPPOOption && quoteType === 'addDPPO') {
    dto.DPPOOption = 'NEW_QUOTE';
  }
  if (needsDPPOOption && quoteType === 'replaceDPPO') {
    dto.DPPOOption = 'ADD_TO_EXISTING_QUOTE';
  }

  // dto.medicalQuoteType = quoteType;
  const form = new FormData();
  form.append('dto', JSON.stringify(dto));
  form.append('files', fileToUpload);
  ops.body = form;
  try {
    const client = yield select(selectClientRequest());
    yield put(loadingQuote(true));
    const url = `${BENREVO_API_PATH}/admin/quotes/${client.brokerId}/${client.id}`;
    yield put(closeQuoteTypesModal({ quoteType: typeOfModal, validateQuote: {} }));
    yield call(request, url, ops, true);
    yield put(loadingQuote(false));
    yield put(getDownloadedQuotes());
  } catch (error) {
    yield put(closeQuoteTypesModal({ quoteType: typeOfModal, validateQuote: {} }));
    console.error(error);
  }
}

export function* removeQuoteSaga(action) {
  const ops = {
    method: 'DELETE',
  };
  let deletingName;
  if (action.payload.name === 'Dental') {
    deletingName = 'DENTAL';
  } else if (action.payload.name === 'Vision') {
    deletingName = 'VISION';
  } else {
    deletingName = 'MEDICAL';
  }
  const deletingType = action.payload.type ? action.payload.type : 'STANDARD';
  try {
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/admin/quotes/delete/${client.id}/${deletingName}?quoteType=${deletingType}`;
    yield call(request, url, ops);
    yield put(getDownloadedQuotes());
  } catch (error) {
    console.error(error);
  }
}

export function* watchFetchData() {
  yield takeEvery(types.GET_DOWNLOADED_QUOTES, loadDownloadedQuotesSaga);
  yield takeEvery(types.VALIDATE_QUOTE, validateQuoteSaga);
  yield takeEvery(types.REMOVE_QUOTE, removeQuoteSaga);
  yield takeEvery(types.QUOTE_TYPE_SELECTED, uploadQuoteSaga);
}

export default [
  watchFetchData,
];


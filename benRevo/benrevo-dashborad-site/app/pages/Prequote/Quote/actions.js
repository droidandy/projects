import * as types from '../constants';

export function loadingQuote(isLoad) {
  return {
    type: types.LOADING_QUOTE,
    payload: isLoad,
  };
}

export function getDownloadedQuotes() {
  return {
    type: types.GET_DOWNLOADED_QUOTES,
  };
}

export function receiveDownloadedQuotes(data) {
  return {
    type: types.RECEIVE_DOWNLOADED_QUOTES,
    payload: data,
  };
}

export function uploadQuote(data, quoteType, validateResp) {
  return {
    type: types.UPLOAD_QUOTE,
    payload: {
      data,
      quoteType,
      validateResp,
    },

  };
}

export function validateQuote(data, quoteType) {
  return {
    type: types.VALIDATE_QUOTE,
    payload: {
      data,
      quoteType,
    },
  };
}

export function removeQuote(data) {
  return {
    type: types.REMOVE_QUOTE,
    payload: data,
  };
}

export function openQuoteTypesModal(payload) {
  return {
    type: types.OPEN_QUOTE_TYPES_MODAL,
    payload,
  };
}

export function closeQuoteTypesModal(payload) {
  return {
    type: types.CLOSE_QUOTE_TYPES_MODAL,
    payload,
  };
}

export function openUploadQuotesErrorsModal(errors) {
  return {
    type: types.OPEN_UPLOAD_QUOTE_ERRORS_MODAL,
    payload: errors,
  };
}


export function closeUploadQuotesErrorsModal() {
  return {
    type: types.CLOSE_UPLOAD_QUOTE_ERRORS_MODAL,
  };
}

export function selectQuoteType(fileToUpload, quoteType) {
  return {
    type: types.QUOTE_TYPE_SELECTED,
    payload: fileToUpload,
    quoteType,
  };
}

export function setQuoteType(quoteType) {
  return {
    type: types.SET_QUOTE_TYPE,
    payload: quoteType,
  };
}

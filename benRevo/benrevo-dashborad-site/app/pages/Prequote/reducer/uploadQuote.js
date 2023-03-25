import { fromJS } from 'immutable';
import * as types from '../constants';

function loadDownloadedQuotes(state, action) {
  return state.setIn(['uploadQuote', 'files'], fromJS(action.payload));
}

function loadingQuote(state, action) {
  return state.setIn(['uploadQuote', 'isLoadingQuote'], action.payload);
}

function openQuoteTypesModal(state, action) {
  return state.setIn(['uploadQuote', action.payload.quoteType, 'validation'], fromJS(action.payload.validateQuote));
}

function closeQuoteTypesModal(state, action) {
  return state.setIn(['uploadQuote', action.payload.quoteType, 'validation'], fromJS(action.payload.validateQuote));
}

function openErrorsQuoteModal(state, action) {
  const newState = state.setIn(['uploadQuote', 'errorsModal'], true);
  return newState.setIn(['uploadQuote', 'errors'], fromJS(action.payload));
}

function closeErrorsQuoteModal(state) {
  return state.setIn(['uploadQuote', 'errorsModal'], false);
}

function setQuoteType(state, action) {
  return state.setIn(['uploadQuote', 'quoteType'], action.payload);
}

export function reducer(state, action) {
  switch (action.type) {
    case types.RECEIVE_DOWNLOADED_QUOTES:
      return loadDownloadedQuotes(state, action);
    case types.LOADING_QUOTE:
      return loadingQuote(state, action);
    case types.OPEN_QUOTE_TYPES_MODAL:
      return openQuoteTypesModal(state, action);
    case types.CLOSE_QUOTE_TYPES_MODAL:
      return closeQuoteTypesModal(state, action);
    case types.OPEN_UPLOAD_QUOTE_ERRORS_MODAL:
      return openErrorsQuoteModal(state, action);
    case types.CLOSE_UPLOAD_QUOTE_ERRORS_MODAL:
      return closeErrorsQuoteModal(state, action);
    case types.SET_QUOTE_TYPE:
      return setQuoteType(state, action);
    default: return state;
  }
}

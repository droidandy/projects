import { fromJS } from 'immutable';
import * as types from '../constants';

export function getDocuments(state) {
  return state
    .setIn(['documents', 'loading'], true);
}

export function getDocumentsSuccess(state, action) {
  return state
    .setIn(['documents', 'data'], fromJS(action.payload))
    .setIn(['documents', 'loading'], false);
}

export function getDocumentsError(state) {
  return state
    .setIn(['documents', 'loading'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.GET_DOCUMENTS: return getDocuments(state, action);
    case types.GET_DOCUMENTS_SUCCESS: return getDocumentsSuccess(state, action);
    case types.GET_DOCUMENTS_ERROR: return getDocumentsError(state, action);
    default: return state;
  }
}

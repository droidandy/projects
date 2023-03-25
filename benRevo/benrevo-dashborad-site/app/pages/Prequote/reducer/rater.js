import { fromJS } from 'immutable';
import {
  RATERS_GET_SUCCESS,
  HISTORY_GET_SUCCESS,
  CHANGE_RATER,
  CHANGE_NOTE,
  SEND_TO_RATER,
  SEND_TO_RATER_SUCCESS,
  SEND_TO_RATER_ERROR,
  CHANGE_SENT,
} from '../constants';

export function ratersGetSuccess(state, action) {
  return state
    .setIn(['rater', 'raters'], fromJS(action.payload));
}

export function historyGetSuccess(state, action) {
  return state
    .setIn(['rater', 'history'], fromJS(action.payload));
}

export function changeRater(state, action) {
  return state
    .setIn(['rater', 'selectedRater'], fromJS(action.payload));
}

export function changeNote(state, action) {
  return state
    .setIn(['rater', 'note'], fromJS(action.payload));
}

export function sendToRater(state) {
  return state
    .setIn(['rater', 'sending'], true);
}

export function sendToRaterSuccess(state) {
  return state
    .setIn(['rater', 'sending'], false)
    .setIn(['rater', 'sent'], true);
}

export function sendToRaterError(state) {
  return state
    .setIn(['rater', 'sending'], false);
}

export function changeSent(state, action) {
  return state
    .setIn(['rater', 'sent'], action.payload);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case RATERS_GET_SUCCESS: return ratersGetSuccess(state, action);
    case HISTORY_GET_SUCCESS: return historyGetSuccess(state, action);
    case CHANGE_RATER: return changeRater(state, action);
    case CHANGE_NOTE: return changeNote(state, action);
    case SEND_TO_RATER: return sendToRater(state, action);
    case SEND_TO_RATER_SUCCESS: return sendToRaterSuccess(state, action);
    case SEND_TO_RATER_ERROR: return sendToRaterError(state, action);
    case CHANGE_SENT: return changeSent(state, action);
    default: return state;
  }
}

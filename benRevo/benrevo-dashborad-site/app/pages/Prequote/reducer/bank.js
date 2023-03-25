import { fromJS } from 'immutable';
import {
  RATE_BANK_SUCCESS,
  SEND_RATE_BANK_CHANGED,
  SENDING_RATE_BANK,
  CHANGE_EDIT_TABLE,
  RATE_HISTORY_SUCCESS,
  EDITED_TABLE_INPUT,
  CHANGE_EDIT_BUDGET,
  EDITED_BUDGET_INPUT,
} from '../constants';

export function rateBankSuccess(state, action) {
  const data = action.payload;
  return state
    .setIn(['bank', 'rateBank'], fromJS(data || {}));
}

export function historyBankSuccess(state, action) {
  const data = action.payload;
  return state
    .setIn(['bank', 'history'], fromJS(data || {}));
}

export function changeSentBank(state, action) {
  return state
    .setIn(['bank', 'sent'], action.payload);
}

export function changeSendingBank(state, action) {
  return state
    .setIn(['bank', 'sending'], action.payload);
}

export function isTableEdit(state, action) {
  if (action.payload) {
    return state
    .setIn(['bank', 'isTableEdit'], action.payload);
  }
  return state
    .setIn(['bank', 'editedTableInputs'], fromJS({}))
    .setIn(['bank', 'isTableEdit'], action.payload);
}

export function isBudgetEdit(state, action) {
  if (action.payload) {
    return state
    .setIn(['bank', 'isBudgetEdit'], action.payload);
  }
  return state
    .setIn(['bank', 'editedBudgetInputs'], fromJS({}))
    .setIn(['bank', 'isBudgetEdit'], action.payload);
}

export function editedTableInput(state, { payload: { id, value } }) {
  return state
    .setIn(['bank', 'editedTableInputs', id], value);
}

export function editedBudgetInput(state, { payload: { name, value } }) {
  return state
    .setIn(['bank', 'editedBudgetInputs', name], value);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case CHANGE_EDIT_BUDGET: return isBudgetEdit(state, action);
    case CHANGE_EDIT_TABLE: return isTableEdit(state, action);
    case RATE_BANK_SUCCESS: return rateBankSuccess(state, action);
    case RATE_HISTORY_SUCCESS: return historyBankSuccess(state, action);
    case SEND_RATE_BANK_CHANGED: return changeSentBank(state, action);
    case SENDING_RATE_BANK: return changeSendingBank(state, action);
    case EDITED_TABLE_INPUT: return editedTableInput(state, action);
    case EDITED_BUDGET_INPUT: return editedBudgetInput(state, action);
    default: return state;
  }
}

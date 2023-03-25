import { call, put, takeEvery, select } from 'redux-saga/effects';
import {
  selectClientRequest,
} from '@benrevo/benrevo-react-rfp';
import { BENREVO_API_PATH } from '../../../config';
import request from '../../../utils/request';
import * as types from '../constants';
import { getHistoryBank, rateBankSuccess } from '../actions';
import { } from '../selectors';

export function* getRateBank(action) {
  const ops = {
    method: 'GET',
  };
  try {
    const quoteType = action.payload.quoteType;
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.RATE_BANK_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.RATE_BANK_ERROR, payload: error });
  }
}

export function* getBankHistory(action) {
  const ops = {
    method: 'GET',
  };
  try {
    const quoteType = action.payload.quoteType;
    const channel = 'EMAIL';
    const name = `${quoteType}_RATE_BANK_REQUEST`;
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/notifications/${client.id}/${channel}/${name}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.RATE_HISTORY_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.RATE_HISTORY_ERROR, payload: error });
  }
}

export function* saveTableData(action) {
  const ops = {
    method: 'PUT',
  };
  const rateBankData = yield select((state) => {
    const rfp = state.get('rfp');
    const bank = rfp.get('bank');
    const rateBank = bank.get('rateBank').toJS();
    const tableInputs = bank.get('editedTableInputs').toJS();
    const plans = rateBank.plans.map((plan, i) => {
      const changedValue = tableInputs[i];
      if (changedValue) {
        return { ...plan, networkRateBank: +changedValue };
      }
      return plan;
    });
    Object.keys(rateBank).forEach((key) => {
      if (rateBank[key] === null) { rateBank[key] = 0; }
    });
    return { ...rateBank, plans };
  });
  try {
    const quoteType = action.payload.quoteType;
    const body = rateBankData;
    ops.body = JSON.stringify(body);
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/update`;
    const data = yield call(request, url, ops);
    yield put(rateBankSuccess(data));
  } catch (error) {
    yield put({ type: types.RATE_BANK_ERROR, payload: error });
  }
}

export function* saveBudgetData(action) {
  const ops = {
    method: 'PUT',
  };
  const rateBankData = yield select((state) => {
    const rfp = state.get('rfp');
    const bank = rfp.get('bank');
    const rateBank = bank.get('rateBank').toJS();
    const budgetInputs = bank.get('editedBudgetInputs').toJS();
    const filteredRateBank = { ...rateBank, ...budgetInputs };
    Object.keys(rateBank).forEach((key) => {
      if (filteredRateBank[key] === null) { filteredRateBank[key] = 0; }
    });
    return filteredRateBank;
  });
  try {
    const quoteType = action.payload.quoteType;
    const body = rateBankData;
    ops.body = JSON.stringify(body);
    const client = yield select(selectClientRequest());
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/update`;
    const data = yield call(request, url, ops);
    yield put(rateBankSuccess(data));
  } catch (error) {
    yield put({ type: types.RATE_BANK_ERROR, payload: error });
  }
}

export function* sendRateBank(action) {
  const ops = {
    method: 'POST',
  };
  ops.headers = new Headers();
  ops.headers.append('Accept', 'application/json');
  const form = new FormData();
  action.payload.files.forEach((item) => form.append('files[]', item));
  ops.body = form;

  try {
    const quoteType = action.payload.quoteType;
    const client = yield select(selectClientRequest());
    yield put({ type: types.SENDING_RATE_BANK, payload: true });
    const url = `${BENREVO_API_PATH}/dashboard/client/${client.id}/rateBank/${quoteType}/send?note=${action.payload.note}`;
    const data = yield call(request, url, ops);
    yield put({ type: types.SEND_RATE_BANK_SUCCESS, payload: data });
    yield put({ type: types.SEND_RATE_BANK_CHANGED, payload: true });
    yield put({ type: types.SENDING_RATE_BANK, payload: false });
    yield put(getHistoryBank(quoteType));
  } catch (error) {
    yield put({ type: types.SEND_RATE_BANK_ERROR, payload: error });
    yield put({ type: types.SENDING_RATE_BANK, payload: false });
  }
}

export function* watchFetchData() {
  yield takeEvery(types.RATE_BANK_GET, getRateBank);
  yield takeEvery(types.SAVE_TABLE_DATA, saveTableData);
  yield takeEvery(types.RATE_HISTORY_GET, getBankHistory);
  yield takeEvery(types.SEND_RATE_BANK, sendRateBank);
  yield takeEvery(types.SAVE_BUDGET_DATA, saveBudgetData);
}

export default [
  watchFetchData,
];

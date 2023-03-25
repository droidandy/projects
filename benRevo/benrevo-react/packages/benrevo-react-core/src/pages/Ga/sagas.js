import { call, put, takeLatest, select } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { BENREVO_API_PATH, BENREVO_PATH } from '../../config';
import { selectAccount, selectGAStatus, selectBrokerage } from './selectors';
import request from './../../utils/request';
import {
  VERIFY_GA_AGENT_EMAIL,
  VERIFY_GA_AGENT_EMAIL_SUCCCESS,
  VERIFY_GA_AGENT_EMAIL_ERROR,
  CREATE_GA_AGENT_ACCOUNT,
  CREATE_GA_AGENT_ACCOUNT_SUCCESS,
  CREATE_GA_AGENT_ACCOUNT_ERROR,
  CHECK_IF_GA,
} from './constants';

export function* createAccount() {
  try {
    const account = yield select(selectAccount);
    const brokerage = yield select(selectBrokerage);
    let ops = {
      method: 'GET',
    };
    const check = yield call(request, `${BENREVO_API_PATH}/v1/brokers/generalAgents`, ops);
    for (let i = 0; i < check.length; i += 1) {
      if (check[i].name === brokerage) {
        account.gaAddress = check[i].address;
        account.gaCity = check[i].city;
        account.gaId = check[i].id;
        account.gaName = check[i].name;
        account.gaState = check[i].state;
        account.gaZip = check[i].zip;
        break;
      }
    }
    ops = {
      method: 'POST',
      body: JSON.stringify(account),
      headers: new Headers(),
    };
    const url = `${BENREVO_API_PATH}/v1/accountRequest`;
    const data = yield call(request, url, ops, false, true);
    yield put({ type: CREATE_GA_AGENT_ACCOUNT_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: CREATE_GA_AGENT_ACCOUNT_ERROR, payload: error });
  }
}

export function* verifyAgentEmail(action) {
  const verificationCode = action.payload;
  const ops = {
    method: 'POST',
    headers: new Headers(),
  };
  const url = `${BENREVO_API_PATH}/v1/verifyEmail?verificationCode=${verificationCode}`;
  try {
    const data = yield call(request, url, ops, false, true);
    yield put({ type: VERIFY_GA_AGENT_EMAIL_SUCCCESS, payload: data });
  } catch (error) {
    yield put({ type: VERIFY_GA_AGENT_EMAIL_ERROR, payload: error });
  }
}

export function* checkIfGA() {
  const isGA = yield select(selectGAStatus);
  if (!isGA) {
    const pathname = browserHistory.getCurrentLocation().pathname;
    const currentPath = pathname.substr(BENREVO_PATH.length - 1, pathname.length);
    yield put(replace({
      pathname: '/',
      state: { nextPathname: currentPath },
    }));
  }
}

export function* watchFetchData() {
  yield takeLatest(CREATE_GA_AGENT_ACCOUNT, createAccount);
  yield takeLatest(VERIFY_GA_AGENT_EMAIL, verifyAgentEmail);
  yield takeLatest(CHECK_IF_GA, checkIfGA);
}

export default [
  watchFetchData,
];

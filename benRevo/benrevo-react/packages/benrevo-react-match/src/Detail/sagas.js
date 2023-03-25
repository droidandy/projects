import { call, put, takeLatest } from 'redux-saga/effects';
import { request, BENREVO_API_PATH, Logger } from '@benrevo/benrevo-react-core';
import {
  GET_ALTERNATIVES,
  GET_ALTERNATIVES_SUCCESS,
  GET_ALTERNATIVES_ERROR,
} from './../constants';

export function* getQuotesOptionsAlternatives(action) {
  const { section } = action.meta;
  const { rfpQuoteOptionNetworkId, rfpQuoteNetworkId, multiMode } = action.payload;
  try {
    let url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${rfpQuoteOptionNetworkId}`;
    if (multiMode) url += `&rfpQuoteNetworkId=${rfpQuoteNetworkId}`;
    const data = yield call(request, url);
    // Splunk warning: Send a warn event to Splunk if a plan does not have its benefit summary.
    const plans = (data && data.plans && data.plans.length) ? data.plans : [];
    let warnString = '';
    plans.forEach((plan, index) => {
      if (!plan.summaryFileLink && index > 0) {
        warnString += `${plan.rfpQuoteNetworkPlanId} `;
      }
    });
    if (warnString.length) {
      Logger.info(`Plans with such rfpQuoteNetworkPlanIds have no summary file link: ${warnString}`);
    }
    yield put({ type: GET_ALTERNATIVES_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: GET_ALTERNATIVES_ERROR, payload: err, meta: { section } });
  }
}

export function* watchFetchData() {
  yield takeLatest(GET_ALTERNATIVES, getQuotesOptionsAlternatives);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

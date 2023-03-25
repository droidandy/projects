import { fromJS } from 'immutable';
import {
  QUOTE_PLANS_GET_SUCCESS,
  CHANGE_DISCOUNT,
  SUMMARY_GET,
  SUMMARY_GET_SUCCESS,
  CHANGE_SUMMARY,
  CHANGE_SENT_BROKER,
  SEND_TO_BROKER,
  SEND_TO_BROKER_SUCCESS,
  SEND_TO_BROKER_ERROR,
} from '../constants';

export function quotePlansGetSuccess(state, action) {
  const data = action.payload;
  return state
    .setIn(['send', 'medicalDiscount'], fromJS(data.medicalDiscount || false))
    .setIn(['send', 'dentalDiscount'], fromJS(data.dentalDiscount || false))
    .setIn(['send', 'visionDiscount'], fromJS(data.visionDiscount || false))
    .setIn(['send', 'lifeDiscount'], fromJS(data.lifeDiscount || false))
    .setIn(['send', 'premiumCredit'], fromJS(data.premiumCredit || 0))
    .setIn(['send', 'projectedBundleDiscount'], fromJS(data.projectedBundleDiscount || 0))
    .setIn(['send', 'projectedBundleDiscountPercent'], fromJS(data.projectedBundleDiscountPercent || 0))
    .setIn(['send', 'totalAnnualPremium'], fromJS(data.totalAnnualPremium || 0))
    .setIn(['send', 'totalAnnualPremiumWithDiscount'], fromJS(data.totalAnnualPremiumWithDiscount || 0))
    .setIn(['send', 'clientMembers'], fromJS(data.clientMembers || []))
    .setIn(['send', 'medicalQuote'], fromJS(data.medicalQuote || {}))
    .setIn(['send', 'kaiserQuote'], fromJS(data.kaiserQuote || {}))
    .setIn(['send', 'dentalQuote'], fromJS(data.dentalQuote || {}))
    .setIn(['send', 'visionQuote'], fromJS(data.visionQuote || {}))
    .setIn(['send', 'lifeQuote'], fromJS(data.lifeQuote || {}));
}

export function changeDiscount(state, action) {
  const data = action.payload;
  return state
    .setIn(['send', `${data.product}Discount`], data.select);
}

export function summaryGet(state) {
  return state
    .setIn(['summaryLoaded'], false)
    .setIn(['summaries'], fromJS({}));
}

export function summaryGetSuccess(state, action) {
  if (!action.payload.medicalNotes && !action.payload.medicalWithKaiserNotes && !action.payload.dentalNotes && !action.payload.visionNotes) {
    return state.setIn(['loadingSummary'], false);
  }
  return state
    .setIn(['summaryLoaded'], true)
    .setIn(['send', 'summaries', 'medical'], action.payload.medicalNotes)
    .setIn(['send', 'summaries', 'dental'], action.payload.dentalNotes)
    .setIn(['send', 'summaries', 'vision'], action.payload.visionNotes);
}

export function changeSummary(state, action) {
  return state
    .setIn(['send', 'summaries', action.payload.section], action.payload.value);
}

export function changeSentBroker(state, action) {
  return state
    .setIn(['send', 'sent'], action.payload);
}

export function sendToBroker(state) {
  return state
    .setIn(['send', 'sending'], true);
}

export function sendToBrokerSuccess(state) {
  return state
    .setIn(['send', 'sending'], false)
    .setIn(['send', 'sent'], true);
}

export function sendToBrokerError(state) {
  return state
    .setIn(['send', 'sending'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case QUOTE_PLANS_GET_SUCCESS: return quotePlansGetSuccess(state, action);
    case CHANGE_DISCOUNT: return changeDiscount(state, action);
    case SUMMARY_GET: return summaryGet(state, action);
    case SUMMARY_GET_SUCCESS: return summaryGetSuccess(state, action);
    case CHANGE_SUMMARY: return changeSummary(state, action);
    case CHANGE_SENT_BROKER: return changeSentBroker(state, action);
    case SEND_TO_BROKER: return sendToBroker(state, action);
    case SEND_TO_BROKER_SUCCESS: return sendToBrokerSuccess(state, action);
    case SEND_TO_BROKER_ERROR: return sendToBrokerError(state, action);
    default: return state;
  }
}

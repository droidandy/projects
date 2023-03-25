import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import { getEnrollment } from '@benrevo/benrevo-react-quote';
import {
  getAllCarriers,
  saveRfp,
  getRfp,
  uploadFile,
  removeFile,
  getPdf,
  checkCensusType,
  saveRfpPlans,
  getPlanNetworks,
  selectClientRequest,
  selectRfpSelected,
  selectRfp,
  resetRfpState,
  SEND_RFP, SEND_RFP_TO_CARRIER_ERROR,
  FETCH_RFP, RFP_SUBMIT, RFP_SUBMITTED_SUCCESS,
  SEND_RFP_FILE,
  FETCH_RFP_PDF, CHANGE_CURRENT_CARRIER,
  CHECK_CENSUS_TYPE,
  REMOVE_FILE, REMOVE_PLAN_FILE,
  FETCH_CARRIERS,
  RFP_PLANS_SAVE,
  GET_RFP_STATUS,
  GET_RFP_STATUS_SUCCESS,
  GET_RFP_STATUS_ERROR,
} from '@benrevo/benrevo-react-rfp';
import { GET_MARKETING_STATUS_LIST, GET_VALIDATE, GET_MARKETING_STATUS_LIST_ERROR } from './../Clients/constants';
import * as types from './constants';
import { selectRfpData, selectCurrentOptionState, selectCurrentOptionRequest, selectBenefitsFromSection } from './selectors';
import { getPlans, savePlans } from './actions';
import { makeSelectRfpcarriers, selectCarrierById } from '../App/selectors';

export function* submitRfpToCarrier() {
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    const data = yield select(selectRfpData);
    const submitUrl = `${BENREVO_API_PATH}/broker/clients/${client.id}/rfps/submit`;
    ops.headers = new Headers();
    ops.body = JSON.stringify(data);
    let response = [];
    const rfpSubmission = yield call(request, submitUrl, ops);
    response = response.concat(rfpSubmission);
    yield put({ type: RFP_SUBMITTED_SUCCESS, payload: response });
  } catch (error) {
    yield put({ type: SEND_RFP_TO_CARRIER_ERROR, payload: error });
  }
}

export function* getStatus() {
  try {
    const ops = {
      method: 'GET',
    };
    const rfpcarriers = yield select(makeSelectRfpcarriers());
    const data = yield select(selectRfp());
    const rfpIds = yield select(selectRfpSelected());
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const standard = yield call(request, `${BENREVO_API_PATH}/v1/clients/${data.client.get('id')}/rfp/status?rfpIds=${rfpIds.join(',')}`, ops);

    yield put({ type: GET_RFP_STATUS_SUCCESS, payload: { data: standard, rfpcarriers } });
  } catch (error) {
    yield put({ type: GET_RFP_STATUS_ERROR, payload: error });
  }
}

export function* getCarrierEmails() {
  try {
    const ops = {
      method: 'GET',
    };
    ops.headers = new Headers();
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const data = yield call(request, `${BENREVO_API_PATH}/v1/brokers/config?type=CARRIER_EMAILS`, ops);
    yield put({ type: types.GET_CARRIER_EMAILS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: types.GET_CARRIER_EMAILS_ERROR, payload: error });
  }
}

export function* updateList() {
  try {
    const client = yield select(selectClientRequest());
    yield put({ type: GET_MARKETING_STATUS_LIST, payload: client.id });
    yield put({ type: GET_VALIDATE, payload: client.id });
  } catch (error) {
    yield put({ type: GET_MARKETING_STATUS_LIST_ERROR, payload: error });
  }
}

export function* getCurrentOption(action) {
  const product = action.meta.section;
  const { optionId } = action.payload;
  try {
    const client = yield select(selectClientRequest());
    let url = `${BENREVO_API_PATH}/broker/presentation/getOption?product=${product.toUpperCase()}&clientId=${client.id}`;

    if (optionId) url = `${url}&rfpQuoteOptionId=${optionId}`;

    yield put(resetRfpState());

    const data = yield call(request, url);
    const finalData = yield select(selectCurrentOptionState(data, product));
    yield put({ type: types.GET_CURRENT_OPTION_SUCCESS, payload: finalData.rfp, meta: { section: product } });
    const productPlans = finalData.rfp.get(product).get('plans').toJS();
    yield put(getPlans(product, productPlans, !!optionId));
    for (let i = 0; i < productPlans.length; i += 1) {
      const plan = productPlans[i];
      const { carrierId } = plan.selectedCarrier;
      if (carrierId) {
        yield call(getPlanNetworks, {
          meta: {
            section: product,
          },
          payload: { carrierId, index: i, planType: plan.title },
        });
      }
    }
  } catch (error) {
    yield put({ type: types.GET_CURRENT_OPTION_ERROR, payload: error });
  }
}

export function* getCurrentPlans(action) {
  const product = action.meta.section;
  try {
    const clientPlans = action.payload.data;
    const { isRenewal } = action.payload;
    const plans = [];
    for (let i = 0; i < clientPlans.length; i += 1) {
      const item = clientPlans[i];
      const id = !isRenewal ? item.id : item.incumbentPlanId;

      if (id) {
        const plan = yield call(request, `${BENREVO_API_PATH}/admin/clients/plans/${id}/`);
        plans.push(plan);

        if (!plan.planType) plan.planType = item.title;
      }
    }

    yield put({ type: types.PLANS_GET_SUCCESS, payload: { plans, clientPlans }, meta: { section: product } });
  } catch (err) {
    yield put({ type: types.PLANS_GET_ERROR, payload: err, meta: { section: product } });
  }
}

export function* createCurrentPlans(action) {
  const { section } = action.meta;
  const { isRenewal } = action.payload;
  const { plans, clientPlans } = yield select(selectBenefitsFromSection(section));
  try {
    for (let i = 0; i < clientPlans.length; i += 1) {
      const clientPlan = clientPlans[i];
      const id = !isRenewal ? clientPlan.id : clientPlan.incumbentPlanId;
      const carrier = yield select(selectCarrierById(clientPlan.selectedCarrier.carrierId, section));
      const url = `${BENREVO_API_PATH}/admin/clients/plans/createPlan/?clientPlanIds=${id}`;
      const ops = {
        method: 'POST',
      };
      ops.headers = new Headers();
      ops.headers.append('Content-Type', 'application/json;charset=UTF-8');
      ops.body = JSON.stringify(convertPlan(plans[i], carrier, clientPlan.selectedNetwork.networkId, clientPlan.name));
      const data = yield call(request, url, ops, true);
      yield put({ type: types.PLANS_SAVE_SUCCESS, payload: data, meta: { section } });
    }
  } catch (err) {
    yield put({ type: types.PLANS_SAVE_ERROR, payload: err, meta: { section } });
  }
}

export function convertPlan(plan = {}, carrier = {}, networkId, name = '') {
  const benefits = [];
  if (plan && plan.benefits && plan.benefits.length > 0) {
    plan.benefits.forEach((item) => {
      if (!item.temp) {
        const newItem = {
          name: item.name || null,
          sysName: item.sysName || null,
          type: item.type || null,
          typeIn: item.typeIn || null,
          typeOut: item.typeOut || null,
          value: item.value || null,
          valueIn: item.valueIn || null,
          valueOut: item.valueOut || null,
        };
        benefits.push(newItem);
      }
    });
  }
  const result = {
    benefits,
    cost: [],
    rx: [],
    nameByNetwork: plan.planName || name,
    rfpQuoteNetworkId: networkId,
    rfpQuoteNetworkPlanId: plan.rfpQuoteNetworkPlanId,
  };
  if (carrier.name !== 'UHC') { // AETNA, BLUE_SHIELD, HEALTHNET
    result.rx = plan.rx;
  } else {
    result.extRx = {
      carrier: '',
      name: plan.planName || '',
      rfpQuoteNetworkPlanId: plan.rfpQuoteNetworkPlanId,
      rx: plan.rx,
    };
  }
  return result;
}

export function* saveCurrentOption(action) {
  const { section } = action.meta;
  const { optionId } = action.payload;
  const ops = {
    method: 'PUT',
  };
  try {
    const url = `${BENREVO_API_PATH}/broker/presentation/updateOption`;
    const rfp = yield select(selectCurrentOptionRequest(section));
    if (optionId) rfp.rfpQuoteOptionId = optionId;
    ops.body = JSON.stringify(rfp);
    const result = yield call(request, url, ops);
    const data = yield select(selectCurrentOptionState(result, section));
    yield put({ type: types.SAVE_CURRENT_OPTION_SUCCESS, payload: data.rfp });
    yield put(getEnrollment());
    yield put(savePlans(section, !!optionId));
  } catch (error) {
    yield put({ type: types.SAVE_CURRENT_OPTION_ERROR, payload: error });
  }
}

export function* getCurrentAncillaryOptions(action) {
  const product = action.meta.section;
  const { simpleSection, isRenewal, optionId } = action.payload;
  try {
    const client = yield select(selectClientRequest());
    let url = '';
    let data = [];
    if (!isRenewal) url = `${BENREVO_API_PATH}/v1/clients/${client.id}/plans/ancillary?product=${product.toUpperCase()}`;
    else url = `${BENREVO_API_PATH}/v1/quotes/options/ancillary/${optionId}`;
    yield put(resetRfpState());
    data = yield call(request, url);

    if (isRenewal) {
      const { plans } = data;

      for (let i = 0; i < plans.length; i += 1) {
        const plan = plans[i];

        if (plan.type === 'alternative') {
          data = [plan];
          break;
        }
      }
    }

    const finalData = yield select(selectCurrentOptionState({ plans: data }, simpleSection));
    yield put({ type: types.GET_CURRENT_ANCILLARY_OPTION_SUCCESS, payload: finalData.rfp, meta: { section: product } });
  } catch (error) {
    yield put({ type: types.GET_CURRENT_ANCILLARY_OPTION_ERROR, payload: error });
  }
}

export function* saveCurrentAncillaryOption(action) {
  const { section } = action.meta;
  const { ancillaryType, simpleSection, isRenewal } = action.payload;
  const ops = {
    method: 'POST',
  };
  try {
    const client = yield select(selectClientRequest());
    let url = `${BENREVO_API_PATH}/v1/clients/${client.id}/plans/createAncillary`;
    const rfp = yield select(selectCurrentOptionRequest(simpleSection, ancillaryType));

    if (rfp.plan && rfp.plan.ancillaryPlanId && !isRenewal) {
      ops.method = 'PUT';
      url = `${BENREVO_API_PATH}/v1/plans/${client.id}/${rfp.plan.ancillaryPlanId}/updateAncillary`;
    } else if (rfp.plan && rfp.plan.rfpQuoteAncillaryPlanId && isRenewal) {
      ops.method = 'PUT';
      url = `${BENREVO_API_PATH}/v1/plans/${rfp.plan.rfpQuoteAncillaryPlanId}/updateQuoteAncillary`;
    }

    ops.body = JSON.stringify(rfp.plan);
    const result = yield call(request, url, ops);
    const data = yield select(selectCurrentOptionState({ plans: [result] }, simpleSection));
    yield put({ type: types.SAVE_CURRENT_ANCILLARY_OPTION_SUCCESS, payload: data.rfp, meta: { section } });
  } catch (error) {
    yield put({ type: types.SAVE_CURRENT_ANCILLARY_OPTION_ERROR, payload: error });
  }
}

export function* watchFetchData() {
  yield takeLatest(RFP_SUBMIT, submitRfpToCarrier);
  yield takeLatest(FETCH_CARRIERS, getAllCarriers);
  yield takeLatest(SEND_RFP, saveRfp);
  yield takeLatest(FETCH_RFP, getRfp);
  yield takeLatest(SEND_RFP_FILE, uploadFile);
  yield takeLatest(REMOVE_FILE, removeFile);
  yield takeLatest(REMOVE_PLAN_FILE, removeFile);
  yield takeEvery(FETCH_RFP_PDF, getPdf);
  yield takeEvery(CHECK_CENSUS_TYPE, checkCensusType);
  yield takeEvery(RFP_PLANS_SAVE, saveRfpPlans);
  yield takeEvery(CHANGE_CURRENT_CARRIER, getPlanNetworks);
  yield takeEvery(GET_RFP_STATUS, getStatus);
  yield takeLatest(types.GET_CARRIER_EMAILS, getCarrierEmails);
  yield takeEvery(RFP_SUBMITTED_SUCCESS, updateList);
  yield takeLatest(types.PLANS_GET, getCurrentPlans);
  yield takeLatest(types.PLANS_SAVE, createCurrentPlans);
  yield takeLatest(types.GET_CURRENT_OPTION, getCurrentOption);
  yield takeLatest(types.SAVE_CURRENT_OPTION, saveCurrentOption);
  yield takeLatest(types.GET_CURRENT_ANCILLARY_OPTION, getCurrentAncillaryOptions);
  yield takeLatest(types.SAVE_CURRENT_ANCILLARY_OPTION, saveCurrentAncillaryOption);
}

export default [
  watchFetchData,
];

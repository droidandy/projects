import { put, takeLatest, select, call, takeEvery } from 'redux-saga/effects';
import {
  PLAN_SELECT_SUCCESS,
  PLAN_SELECT_ERROR,
  ALTERNATIVE_PLAN_EDIT_SUCCESS,
  ALTERNATIVE_PLAN_ADD_SUCCESS,
  refreshPresentationData,
  selectPage,
  changeLoad,
  addOptionForNewProducts,
} from '@benrevo/benrevo-react-quote';
import { request, BENREVO_API_PATH } from '@benrevo/benrevo-react-core';
import * as types from './constants';
import { selectOpenedOption } from './selectors';
import { getAnotherOptions } from './actions';
// import { selectSecondPlan } from './actions';

export function* getMedicalGroups() {
  const url = `${BENREVO_API_PATH}/v1/medical-groups/carriers`;
  try {
    const data = yield call(request, url);
    yield put({ type: types.COMPARISON_GET_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.COMPARISON_GET_ERROR, payload: err });
  }
}

export function* getPlanTemplate(action) {
  const { type } = action.payload;
  const { section } = action.meta;
  try {
    const url = `${BENREVO_API_PATH}/v1/benefitNames/?planType=${type}`;
    const data = yield call(request, url);
    yield put({ type: types.PLAN_TEMPLATE_GET_SUCCESS, payload: { data, type }, meta: { section } });
  } catch (err) {
    yield put({ type: types.PLAN_TEMPLATE_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getPlanTemplates(action) {
  const { section } = action.meta;
  // plan types enum = [HMO, PPO, HSA, DPPO, DHMO, VISION, RX_PPO, RX_HMO]
  const allPlanTypes = {
    medical: ['HMO', 'PPO', 'HSA', 'RX_PPO', 'RX_HMO'],
    dental: ['DPPO', 'DHMO'],
    vision: ['VISION'],
  };
  if (section) {
    try {
      const planTypes = allPlanTypes[section];
      if (planTypes && planTypes.length) {
        for (let i = 0; i <= planTypes.length; i += 1) {
          if (planTypes[i]) {
            yield put({ type: types.PLAN_TEMPLATE_GET, payload: { type: planTypes[i] }, meta: { section } });
          }
        }
      }
    } catch (err) {
      yield put({ type: types.PLAN_TEMPLATE_GET_ERROR, payload: err, meta: {} });
    }
  }
}

export function* changeFavourite(action) {
  const { favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId } = action.payload;
  const { section } = action.meta;
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${!favorite ? 'favoriteNetworkPlan' : 'unfavoriteNetworkPlan'}`;
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify({ rfpQuoteNetworkId, rfpQuoteNetworkPlanId });
    const data = yield call(request, url, ops);
    yield put({ type: types.PLAN_FAVOIRITE_CHANGED_SUCCESS, payload: { data }, meta: { section } });
  } catch (err) {
    yield put({ type: types.PLAN_FAVOIRITE_CHANGED_ERROR, payload: err, meta: { section } });
  }
}

export function* getPlansForDropdown(action) {
  const { section } = action.meta;
  try {
    const openedOption = yield select(selectOpenedOption(section));
    const { detailedPlans } = openedOption;
    const ids = [];
    if (detailedPlans && detailedPlans.length > 0) {
      detailedPlans.forEach((item) => {
        if (item.rfpQuoteNetworkId) {
          ids.push(item.rfpQuoteNetworkId);
        }
      });
    }
    if (!ids.length) throw new Error('No rfpQuoteNetworkIds found');
    const url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives/names?rfpQuoteNetworkIds=${ids}`;
    const data = yield call(request, url);
    yield put({ type: types.GET_ALT_PLANS_FOR_DROPDOWN_SUCCESS, payload: { data }, meta: { section } });
  } catch (err) {
    yield put({ type: types.GET_ALT_PLANS_FOR_DROPDOWN_ERROR, payload: { err }, meta: { section } });
  }
}

export function* changePlanLabel(action) {
  const { rfpQuoteOptionId, displayName, rfpQuoteAncillaryOptionId } = action.payload;
  const { section } = action.meta;
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/update`;
    const ops = {
      method: 'PUT',
    };
    if (rfpQuoteOptionId) ops.body = JSON.stringify({ rfpQuoteOptionId, displayName });
    if (rfpQuoteAncillaryOptionId) ops.body = JSON.stringify({ rfpQuoteAncillaryOptionId, displayName });
    yield call(request, url, ops);
    yield put({ type: types.PLAN_LABEL_CHANGE_SUCCESS, payload: { rfpQuoteOptionId, displayName }, meta: { section } });
    yield put(changeLoad(section, { options: true }));
  } catch (err) {
    yield put({ type: types.PLAN_LABEL_CHANGE_ERROR, payload: err, meta: { section } });
  }
}

export function* selectPlanBroker(action) {
  const { section } = action.meta;
  const { rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, index } = action.payload;
  const ops = {
    method: 'PUT',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selectNetworkPlan`;

    ops.body = JSON.stringify({
      rfpQuoteNetworkPlanId,
      rfpQuoteOptionNetworkId,
    });
    yield call(request, url, ops);
    yield put({ type: PLAN_SELECT_SUCCESS, payload: { rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, index }, meta: { section } });
    const option = yield select(selectOpenedOption(section));
    const page = yield select(selectPage(section));
    yield put(refreshPresentationData(section, page.carrier, option.id, false));
  } catch (err) {
    yield put({ type: PLAN_SELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* getPlansForCompare(action) {
  const { product, carrierIds, clientPlanId, clientId } = action.payload;
  const ancillaryProducts = ['life', 'vol_life', 'ltd', 'vol_ltd', 'std', 'vol_std'];
  try {
    let url = '';
    if (ancillaryProducts.includes(product.toLowerCase())) {
      url = `${BENREVO_API_PATH}/broker/presentation/compareAncillaryPlans?product=${product}&clientId=${clientId}`;
    } else {
      url = `${BENREVO_API_PATH}/broker/presentation/comparePlans?product=${product}&clientPlanId=${clientPlanId}`;
    }

    if (carrierIds && carrierIds.length > 0) {
      url += `&carrierIds=${carrierIds}`;
    }
    const data = yield call(request, url);
    yield put({ type: types.GET_PLANS_FOR_COMPARE_SUCCESS, payload: { data }, meta: { product } });
  } catch (err) {
    yield put({ type: types.GET_PLANS_FOR_COMPARE_ERROR, payload: { err }, meta: {} });
  }
}

export function* getPlansListForFilterCompare(action) {
  const { clientId } = action.payload;
  try {
    const url = `${BENREVO_API_PATH}/admin/clients/${clientId}/plans`;
    const data = yield call(request, url);
    yield put({ type: types.GET_PLANS_LIST_FOR_FILTER_COMPARE_SUCCESS, payload: { data }, meta: {} });
  } catch (err) {
    yield put({ type: types.GET_PLANS_LIST_FOR_FILTER_COMPARE_ERROR, payload: { err }, meta: {} });
  }
}

export function* plansCompareDownload(action) {
  const { product, carrierIds, clientPlanId, clientId } = action.payload;
  const ancillaryProducts = ['life', 'vol_life', 'ltd', 'vol_ltd', 'std', 'vol_std'];
  try {
    let url = '';
    if (ancillaryProducts.includes(product.toLowerCase())) {
      url = `${BENREVO_API_PATH}/broker/presentation/compareAncillaryPlans/file?product=${product}&clientId=${clientId}`;
    } else {
      url = `${BENREVO_API_PATH}/broker/presentation/comparePlans/file?product=${product}&clientPlanId=${clientPlanId}`;
    }
    if (carrierIds && carrierIds.length > 0) {
      url += `&carrierIds=${carrierIds}`;
    }
    const ops = {
      method: 'GET',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const data = yield call(request, url, ops, true);
    let { filename } = data.filename;
    if (!filename) filename = 'ComparePlans.xlsx';
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      if (document.createEvent) {
        const event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        link.dispatchEvent(event);
      } else {
        link.click();
      }
    }
    yield put({ type: types.PLANS_COMPARE_DOWNLOAD_SUCCESS, payload: data });
  } catch (err) {
    yield put({ type: types.PLANS_COMPARE_DOWNLOAD_ERROR, payload: err });
  }
}

export function* getPlansForSelectBenefits(action) {
  const { networkId } = action.payload;
  try {
    const url = `${BENREVO_API_PATH}/v1/network/${networkId}/plans`;
    const data = yield call(request, url);
    yield put({ type: types.GET_PLANS_FOR_SELECT_BENEFITS_SUCCESS, payload: { data }, meta: {} });
  } catch (err) {
    yield put({ type: types.GET_PLANS_FOR_SELECT_BENEFITS_ERROR, payload: { err }, meta: {} });
  }
}

export function* getRxPlansForSelectBenefits(action) {
  const { networkId } = action.payload;
  try {
    const url = `${BENREVO_API_PATH}/v1/network/${networkId}/plans`;
    const data = yield call(request, url);
    yield put({ type: types.GET_RX_PLANS_FOR_SELECT_BENEFITS_SUCCESS, payload: { data }, meta: {} });
  } catch (err) {
    yield put({ type: types.GET_RX_PLANS_FOR_SELECT_BENEFITS_ERROR, payload: { err }, meta: {} });
  }
}

export function* getPlanForBenefits(action) {
  const { pnnId } = action.payload;
  const { section } = action.meta;
  if (pnnId !== 'addPlan') {
    try {
      const url = `${BENREVO_API_PATH}/v1/plans/network/${pnnId}`;
      const data = yield call(request, url);
      yield put({ type: types.GET_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section } });
    } catch (err) {
      yield put({ type: types.GET_PLAN_FOR_BENEFITS_ERROR, payload: { err }, meta: { section } });
    }
  }
}

export function* getRxPlanForBenefits(action) {
  const { pnnId } = action.payload;
  const { section } = action.meta;
  if (pnnId !== 'addPlan') {
    try {
      const url = `${BENREVO_API_PATH}/v1/plans/network/${pnnId}`;
      const data = yield call(request, url);
      yield put({ type: types.GET_RX_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section } });
    } catch (err) {
      yield put({ type: types.GET_RX_PLAN_FOR_BENEFITS_ERROR, payload: { err }, meta: { section } });
    }
  }
}

export function* refreshOptionData(action) {
  const { section } = action.meta;
  const page = yield select(selectPage(section));
  try {
    if (section === types.MEDICAL_SECTION || section === types.DENTAL_SECTION || section === types.VISION_SECTION) {
      const openedOption = yield select(selectOpenedOption(section));
      yield put(refreshPresentationData(section, page.carrier, openedOption.id, false));
    } else {
      const option = {
        carrier: page.carrier,
        id: page.id,
        optionType: page.optionType,
      };
      yield put(addOptionForNewProducts(option, section));
      yield put(getAnotherOptions(section));
    }
  } catch (err) {
    yield put({ type: types.PRESENTATION_REFRESH_ERROR, payload: err, meta: { section } });
  }
}

export function* watchFetchData() {
  yield takeLatest(types.PLAN_TEMPLATES_GET, getPlanTemplates);
  yield takeLatest(types.PLAN_FAVOIRITE_CHANGE, changeFavourite);
  yield takeEvery(types.PLAN_TEMPLATE_GET, getPlanTemplate);
  yield takeEvery(types.GET_ALT_PLANS_FOR_DROPDOWN, getPlansForDropdown);
  yield takeLatest(types.PLAN_LABEL_CHANGE, changePlanLabel);
  yield takeLatest(types.PLAN_SELECT_BROKER, selectPlanBroker);
  yield takeLatest(types.GET_PLANS_FOR_COMPARE, getPlansForCompare);
  yield takeLatest(types.GET_PLANS_LIST_FOR_FILTER_COMPARE, getPlansListForFilterCompare);
  yield takeLatest(types.PLANS_COMPARE_DOWNLOAD, plansCompareDownload);
  yield takeLatest(types.GET_PLANS_FOR_SELECT_BENEFITS, getPlansForSelectBenefits);
  yield takeLatest(types.GET_PLAN_FOR_BENEFITS, getPlanForBenefits);
  yield takeLatest(types.GET_RX_PLAN_FOR_BENEFITS, getRxPlanForBenefits);
  yield takeLatest(types.GET_RX_PLANS_FOR_SELECT_BENEFITS, getRxPlansForSelectBenefits);
  yield takeLatest(PLAN_SELECT_SUCCESS, refreshOptionData);
  yield takeLatest(ALTERNATIVE_PLAN_ADD_SUCCESS, refreshOptionData);
  yield takeLatest(ALTERNATIVE_PLAN_EDIT_SUCCESS, refreshOptionData);
}

export default [
  watchFetchData,
];

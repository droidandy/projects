import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import { request, BENREVO_API_PATH, Logger } from '@benrevo/benrevo-react-core';
import {
  PLANS_GET,
  PLANS_GET_SUCCESS,
  PLANS_GET_ERROR,
  PLAN_SELECT,
  PLAN_SELECT_SUCCESS,
  PLAN_SELECT_ERROR,
  ALTERNATIVE_PLAN_ADD,
  ALTERNATIVE_PLAN_ADD_LIFE,
  ALTERNATIVE_PLAN_ADD_VOL,
  ALTERNATIVE_PLAN_ADD_SUCCESS,
  ALTERNATIVE_PLAN_ADD_ERROR,
  ALTERNATIVE_PLAN_EDIT,
  ALTERNATIVE_PLAN_EDIT_LIFE,
  ALTERNATIVE_PLAN_EDIT_VOL,
  ALTERNATIVE_PLAN_EDIT_SUCCESS,
  ALTERNATIVE_PLAN_EDIT_ERROR,
  ALTERNATIVE_PLAN_DELETE,
  ALTERNATIVE_PLAN_DELETE_SUCCESS,
  ALTERNATIVE_PLAN_DELETE_ERROR,
  SAVE_CURRENT_PLAN,
  SAVE_CURRENT_PLAN_SUCCESS,
  SAVE_CURRENT_PLAN_ERROR,
  PLAN_SECOND_SELECT,
  PLAN_SECOND_SELECT_SUCCESS,
  PLAN_SECOND_SELECT_ERROR,
  PLAN_SELECT_LIFE,
} from '../constants';
import { selectOpenedOption, selectFilter, selectPage, selectMatch, selectNewPlan } from '../selectors';
import { changeLoad, getFinal, clearPlansFilter, refreshPresentationData } from '../actions';

export function* getQuotesOptionsAlternatives(action) {
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const clearFilter = action.payload.clearFilter;
  const multiMode = action.payload.multiMode;
  const filter = yield select(selectFilter(section));
  try {
    const option = yield select(selectOpenedOption(section));
    const detailed = option.detailedPlans;
    if (!detailed[networkIndex].rfpQuoteOptionNetworkId) throw new Error('No rfpQuoteOptionNetworkId found');
    let url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${detailed[networkIndex].rfpQuoteOptionNetworkId}`;
    if (multiMode && detailed[networkIndex].rfpQuoteNetworkId) url += `&rfpQuoteNetworkId=${detailed[networkIndex].rfpQuoteNetworkId}`;

    if (!clearFilter) {
      if (filter.diffPercentTo !== null) {
        url += `&diffPercentFrom=${filter.diffPercentFrom}&diffPercentTo=${filter.diffPercentTo}`;
      }
      if (filter.copayTo !== null) {
        url += `&copayFrom=${filter.copayFrom}&copayTo=${filter.copayTo}`;
      }
      if (filter.deductibleTo !== null) {
        url += `&deductibleFrom=${filter.deductibleFrom}&deductibleTo=${filter.deductibleTo}`;
      }
      if (filter.coinsuranceTo !== null) {
        url += `&coinsuranceFrom=${filter.coinsuranceFrom}&coinsuranceTo=${filter.coinsuranceTo}`;
      }
      if (filter.favourite) {
        url += `&favorite=${filter.favourite}`;
      }
    } else {
      yield put(clearPlansFilter(section));
    }
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
    yield put({ type: PLANS_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: PLANS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* getAlternativePlans(action) {
  const { section } = action.meta;
  const clearFilter = true;
  const { rfpQuoteNetworkId, rfpQuoteOptionNetworkId, multiMode } = action.payload;
  const filter = yield select(selectFilter(section));
  try {
    let url = `${BENREVO_API_PATH}/v1/quotes/options/alternatives?rfpQuoteOptionNetworkId=${rfpQuoteOptionNetworkId}`;
    if (multiMode && rfpQuoteNetworkId) url += `&rfpQuoteNetworkId=${rfpQuoteNetworkId}`;

    if (!clearFilter) {
      if (filter.diffPercentTo !== null) {
        url += `&diffPercentFrom=${filter.diffPercentFrom}&diffPercentTo=${filter.diffPercentTo}`;
      }
      if (filter.copayTo !== null) {
        url += `&copayFrom=${filter.copayFrom}&copayTo=${filter.copayTo}`;
      }
      if (filter.deductibleTo !== null) {
        url += `&deductibleFrom=${filter.deductibleFrom}&deductibleTo=${filter.deductibleTo}`;
      }
      if (filter.coinsuranceTo !== null) {
        url += `&coinsuranceFrom=${filter.coinsuranceFrom}&coinsuranceTo=${filter.coinsuranceTo}`;
      }
      if (filter.favourite) {
        url += `&favorite=${filter.favourite}`;
      }
    } else {
      yield put(clearPlansFilter(section));
    }
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
    yield put({ type: PLANS_GET_SUCCESS, payload: data, meta: { section } });
  } catch (err) {
    yield put({ type: PLANS_GET_ERROR, payload: err, meta: { section } });
  }
}

export function* selectPlan(action) {
  const section = action.meta.section;
  const rfpQuoteNetworkPlanId = action.payload.planId;
  const rfpQuoteOptionNetworkId = action.payload.networkId;
  // const carrier = action.payload.carrier;
  // const networkIndex = action.payload.index;
  const { multiMode } = action.payload;
  const ops = {
    method: 'PUT',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const page = yield select(selectPage(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selectNetworkPlan`;
    const isMatch = yield select(selectMatch());

    ops.body = JSON.stringify({
      rfpQuoteNetworkPlanId,
      rfpQuoteOptionNetworkId,
    });
    yield call(request, url, ops);
    yield put({ type: PLAN_SELECT_SUCCESS, payload: { rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, multiMode }, meta: { section } });
    if (isMatch) {
      const option = yield select(selectOpenedOption(section));
      yield put(refreshPresentationData(section, page.carrier, option.id, false));
    }
    yield put(changeLoad(section, { options: true, overview: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: PLAN_SELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* selectPlanLife(action) {
  const { isSecond } = action;
  const section = action.meta.section;
  const rfpQuoteAncillaryOptionId = action.optionId;
  const { rfpQuoteAncillaryPlanId } = action.payload;
  const networkIndex = action.payload.networkIndex;
  const { multiMode } = false;
  const ops = {
    method: 'PUT',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const url = `${BENREVO_API_PATH}/v1/quotes/options/selectAncillaryPlan`;
    if (!isSecond) {
      ops.body = JSON.stringify({
        rfpQuoteAncillaryOptionId,
        rfpQuoteAncillaryPlanId,
      });
    } else {
      ops.body = JSON.stringify({
        rfpQuoteAncillaryOptionId,
        secondRfpQuoteAncillaryPlanId: rfpQuoteAncillaryPlanId,
      });
    }
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_EDIT_SUCCESS, payload: { data, networkIndex }, meta: { section } });
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
    yield put(changeLoad(section, { options: true, overview: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: PLAN_SELECT_ERROR, payload: err, meta: { section } });
  }
}

export function* selectSecondPlan(action) {
  const section = action.meta.section;
  const { rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index } = action.payload;
  const { multiMode } = action.payload;
  const ops = {
    method: 'PUT',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const page = yield select(selectPage(section));
    const option = yield select(selectOpenedOption(section));
    const url = `${BENREVO_API_PATH}/v1/quotes/options/${actionType === 'select' ? 'selectSecondNetworkPlan' : 'unselectSecondNetworkPlan'}`;
    if (rfpQuoteNetworkPlanId && rfpQuoteOptionNetworkId) {
      ops.body = JSON.stringify({
        rfpQuoteNetworkPlanId,
        rfpQuoteOptionNetworkId,
      });
      yield call(request, url, ops);
      yield put({ type: PLAN_SECOND_SELECT_SUCCESS, payload: { rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, multiMode }, meta: { section } });
      yield put({ type: PLANS_GET, payload: { section, networkIndex: index, multiMode }, meta: { section } });
      yield put(refreshPresentationData(section, page.carrier, option.id, false));
      yield put(changeLoad(section, { options: true, overview: true, compare: true }));
      yield put(getFinal());
    }
  } catch (err) {
    yield put({ type: PLAN_SECOND_SELECT_ERROR, payload: err, meta: { section } });
  }
}


export function* addPlan(action) {
  const section = action.meta.section;
  const { newPlan, networkIndex, multiMode, status, rfpQuoteOptionNetworkId } = action.payload;
  const ops = {
    method: 'POST',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const url = `${BENREVO_API_PATH}/v1/plans/create`;
    delete newPlan.rfpQuoteNetworkPlanId;
    if (status === 'newAlt') {
      delete newPlan.rfpQuoteOptionNetworkId;
    }
    ops.body = JSON.stringify(newPlan);
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_ADD_SUCCESS, payload: data, meta: { section }, status });
    // then selectPlan action.payload.planId; action.payload.networkId; multiMode section
    if (status === 'newAlt') {
      // Auto select as secondselected when you create a new alt plan
      yield put({ type: PLAN_SECOND_SELECT, payload: { rfpQuoteNetworkPlanId: data, rfpQuoteOptionNetworkId, multiMode, actionType: 'select', index: networkIndex }, meta: { section } });
    } else {
      yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
      yield put(changeLoad(section, { options: true, overview: true, compare: true }));
      yield put(getFinal());
    }
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_ADD_ERROR, payload: err, meta: { section } });
  }
}

export function* addPlanLife(action) {
  const newPlan = action.payload.newPlan;
  const rfpQuoteAncillaryOptionId = action.payload.rfpQuoteAncillaryOptionId;
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const multiMode = action.payload.multiMode;
  const newClasses = newPlan.classes.map((itemClass, index) => {
    const newClass = { ...itemClass };
    Object.keys(itemClass).forEach((key) => {
      const matchedBenefits = newPlan.benefits.find((benefit) => benefit.key === key);
      if (matchedBenefits) {
        if (index === 0) {
          newClass[key] = matchedBenefits.value;
        } else if (index === 1) {
          newClass[key] = matchedBenefits.valueTwo;
        } else if (index === 2) {
          newClass[key] = matchedBenefits.valueThree;
        } else {
          newClass[key] = matchedBenefits.valueFour;
        }
      }
    });
    delete newClass.ancillaryClassId;
    return newClass;
  });
  const newRates = { ...newPlan.rates };
  Object.keys(newRates).forEach((key) => {
    const matchedBenefits = newPlan.cost.find((item) => item.key === key);
    if (matchedBenefits) {
      newRates[key] = matchedBenefits.value;
    }
  });
  if (rfpQuoteAncillaryOptionId) newPlan.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
  newPlan.rates = newRates;
  newPlan.classes = newClasses;
  newPlan.planName = newPlan.name || 'plan';
  newPlan.rfpQuoteAncillaryPlanId = null;
  newPlan.rfpQuoteId = action.payload.rfpQuoteId;
  delete newPlan.rates.ancillaryRateId;
  delete newPlan.name;
  delete newPlan.benefits;
  delete newPlan.cost;
  delete newPlan.rx;
  delete newPlan.planYear;
  const ops = {
    method: 'POST',
    headers: new Headers(),
  };
  ops.headers.append('content-type', 'application/json;charset=UTF-8');
  try {
    const url = `${BENREVO_API_PATH}/v1/plans/createQuoteAncillary`;
    ops.body = JSON.stringify(newPlan);
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_ADD_SUCCESS, payload: data, meta: { section }, status });
    // then selectPlan action.payload.planId; action.payload.networkId; multiMode section
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
    yield put(changeLoad(section, { options: true, overview: true, compare: true }));
    yield put(getFinal());
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_ADD_ERROR, payload: err, meta: { section } });
  }
}

export function* addPlanVol(action) {
  const section = action.meta.section;
  const rfpQuoteAncillaryOptionId = action.payload.rfpQuoteAncillaryOptionId;
  const networkIndex = action.payload.networkIndex;
  const status = action.payload.status;
  const multiMode = true;
  try {
    const newPlan = yield select(selectNewPlan(section));
    const match = newPlan.matchPlan;
    if (rfpQuoteAncillaryOptionId && match) newPlan.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
    newPlan.rfpQuoteAncillaryPlanId = null;
    newPlan.rfpQuoteId = action.payload.rfpQuoteId;
    newPlan.planName = newPlan.name || 'plan';
    const filledClasses = [];
    newPlan.classes.forEach((classItem, i) => {
      let filledClass = false;
      Object.keys(classItem).forEach((key) => {
        if (key !== 'name' && key !== 'javaclass') {
          if (newPlan.classes[i] && newPlan.classes[i][key]) {
            filledClass = true;
          }
        }
      });
      if (filledClass) {
        filledClasses.push(classItem);
      }
    });
    newPlan.classes = filledClasses;
    delete newPlan.name;
    delete newPlan.rates.ancillaryRateId;
    delete newPlan.planYear;
    const ops = {
      method: 'POST',
      headers: new Headers(),
    };
    ops.headers.append('content-type', 'application/json;charset=UTF-8');
    const url = `${BENREVO_API_PATH}/v1/plans/createQuoteAncillary`;
    ops.body = JSON.stringify(newPlan);
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_ADD_SUCCESS, payload: data, meta: { section }, status });
    // then selectPlan action.payload.planId; action.payload.networkId; multiMode section
    if (status === 'newAlt') {
      // Auto select as secondselected when you create a new alt plan
      yield put({ type: PLAN_SELECT_LIFE, payload: data, optionId: rfpQuoteAncillaryOptionId, isSecond: true, meta: { section } });
    } else {
      yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
      yield put(changeLoad(section, { options: true, overview: true, compare: true }));
      yield put(getFinal());
    }
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_ADD_ERROR, payload: err, meta: { section } });
  }
}

export function* editPlan(action) {
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const multiMode = action.payload.multiMode;
  const plan = action.payload.plan;
  plan.rfpQuoteNetworkId = action.payload.rfpQuoteNetworkId;
  plan.nameByNetwork = plan.name;
  delete plan.name;
  // plan.cost = plan.cost.slice(3, plan.cost.length);
  plan.cost = plan.cost.slice(1, plan.cost.length);
  const ops = {
    method: 'PUT',
  };
  ops.body = JSON.stringify(plan);
  try {
    const url = `${BENREVO_API_PATH}/v1/plans/update`;
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_EDIT_SUCCESS, payload: { data, networkIndex }, meta: { section } });
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_EDIT_ERROR, payload: err, meta: { section } });
  }
}

export function* editPlanLife(action) {
  const plan = action.payload.plan;
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const multiMode = action.payload.multiMode;
  if (plan.benefits.some((benefit) => benefit.valueThree && plan.classes.length < 3)) {
    plan.classes.push(
        Object.keys(plan.classes[0]).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    );
    plan.classes[2].javaclass = 'LifeClassDto';
    plan.classes[2].name = 'Class 3';
  }
  if (plan.benefits.some((benefit) => benefit.valueFour && plan.classes.length < 4)) {
    plan.classes.push(
        Object.keys(plan.classes[0]).reduce((acc, key) => ({ ...acc, [key]: null }), {}),
    );
    plan.classes[3].javaclass = 'LifeClassDto';
    plan.classes[3].name = 'Class 4';
  }
  const newClasses = plan.classes.map((itemClass, index) => {
    const newClass = { ...itemClass };
    Object.keys(itemClass).forEach((key) => {
      const matchedBenefits = plan.benefits.find((benefit) => benefit.key === key);
      if (matchedBenefits) {
        if (index === 0) {
          newClass[key] = matchedBenefits.value;
        } else if (index === 1) {
          newClass[key] = matchedBenefits.valueTwo;
        } else if (index === 2) {
          newClass[key] = matchedBenefits.valueThree;
        } else {
          newClass[key] = matchedBenefits.valueFour;
        }
      }
    });
    return newClass;
  });
  const newRates = { ...plan.rates };
  Object.keys(newRates).forEach((key) => {
    const matchedBenefits = plan.cost.find((item) => item.key === key);
    if (matchedBenefits) {
      newRates[key] = matchedBenefits.value;
    }
  });
  plan.rates = newRates;
  plan.classes = newClasses;
  plan.planName = plan.name;
  delete plan.name;
  delete plan.benefits;
  delete plan.cost;
  const ops = {
    method: 'PUT',
  };
  ops.body = JSON.stringify(plan);
  try {
    const url = `${BENREVO_API_PATH}/v1/plans/${plan.rfpQuoteAncillaryPlanId}/updateQuoteAncillary`;
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_EDIT_SUCCESS, payload: { data, networkIndex }, meta: { section } });
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_EDIT_ERROR, payload: err, meta: { section } });
  }
}

export function* editPlanVoluntary(action) {
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const newPlan = action.payload.plan;
  newPlan.planName = newPlan.name;
  delete newPlan.name;
  const multiMode = true;
  try {
    const ops = {
      method: 'PUT',
    };
    ops.body = JSON.stringify(newPlan);
    const url = `${BENREVO_API_PATH}/v1/plans/${newPlan.rfpQuoteAncillaryPlanId}/updateQuoteAncillary`;
    const data = yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_EDIT_SUCCESS, payload: { data, networkIndex }, meta: { section } });
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_EDIT_ERROR, payload: err, meta: { section } });
  }
}

export function* saveCurrentPlan(action) {
  const section = action.meta.section;
  const networkIndex = action.payload.networkIndex;
  const multiMode = action.payload.multiMode;
  const plan = action.payload.externalRX || action.payload.plan;
  plan.nameByNetwork = plan.name;
  delete plan.name;
  if (plan.cost) plan.cost = plan.cost.slice(plan.cost.length === 6 ? 6 : 5, plan.cost.length);
  const ops = {
    method: 'PUT',
  };
  ops.body = JSON.stringify(plan);
  try {
    const url = `${BENREVO_API_PATH}/v1/plans/current/${action.payload.plan.clientPlanId}/${action.payload.externalRX ? 'updateRx' : 'update'}`;
    const data = yield call(request, url, ops);
    yield put({ type: SAVE_CURRENT_PLAN_SUCCESS, payload: data, meta: { section } });
    yield put({ type: PLANS_GET, payload: { section, networkIndex, multiMode }, meta: { section } });
  } catch (err) {
    yield put({ type: SAVE_CURRENT_PLAN_ERROR, payload: err, meta: { section } });
  }
}

export function* deletePlan(action) {
  const section = action.meta.section;
  const rfpQuoteNetworkPlanId = action.payload.rfpQuoteNetworkPlanId;
  const rfpQuoteNetworkId = action.payload.rfpQuoteNetworkId;
  const networkIndex = action.payload.networkIndex;
  const multiMode = action.payload.multiMode;
  const url = `${BENREVO_API_PATH}/v1/plans/delete`;
  const ops = {
    method: 'DELETE',
  };
  try {
    ops.body = JSON.stringify({
      rfpQuoteNetworkId,
      rfpQuoteNetworkPlanIds: [
        rfpQuoteNetworkPlanId,
      ],
    });
    yield call(request, url, ops);
    yield put({ type: ALTERNATIVE_PLAN_DELETE_SUCCESS, payload: { networkId: rfpQuoteNetworkId, networkIndex, multiMode }, meta: { section } });
    yield put({ type: PLANS_GET, payload: { networkId: rfpQuoteNetworkId, networkIndex, multiMode }, meta: { section } });
  } catch (err) {
    yield put({ type: ALTERNATIVE_PLAN_DELETE_ERROR, payload: err, meta: { section } });
  }
}

function* watchFetchData() {
  yield takeLatest(PLANS_GET, getQuotesOptionsAlternatives);
  yield takeEvery(PLAN_SELECT, selectPlan);
  yield takeEvery(PLAN_SECOND_SELECT, selectSecondPlan);
  yield takeLatest(ALTERNATIVE_PLAN_ADD, addPlan);
  yield takeLatest(ALTERNATIVE_PLAN_ADD_LIFE, addPlanLife);
  yield takeLatest(ALTERNATIVE_PLAN_ADD_VOL, addPlanVol);
  yield takeLatest(ALTERNATIVE_PLAN_EDIT, editPlan);
  yield takeLatest(ALTERNATIVE_PLAN_EDIT_LIFE, editPlanLife);
  yield takeLatest(ALTERNATIVE_PLAN_EDIT_VOL, editPlanVoluntary);
  yield takeLatest(SAVE_CURRENT_PLAN, saveCurrentPlan);
  yield takeLatest(ALTERNATIVE_PLAN_DELETE, deletePlan);
  yield takeLatest(PLAN_SELECT_SUCCESS, getAlternativePlans);
  yield takeLatest(PLAN_SELECT_LIFE, selectPlanLife);
}

// All sagas to be loaded
export default [
  watchFetchData,
];

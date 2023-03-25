import { fromJS, Map, List } from 'immutable';
import initialRfpMasterState, { createPlan } from './state';
import * as types from '../constants';
import * as formTypes from '../formConstants';
import { mappingLifeStdLtdClassesPlanState } from '../selectors';

export function changeShowErrors(state, action) {
  return state
    .setIn(['common', 'showErrors'], action.payload);
}

export function changeSectionField(state, action) {
  return state
    .setIn([action.meta.section, action.payload.type], action.payload.data);
}

export function addCarrier(state, action) {
  return state
    .setIn([action.meta.section, action.payload.type], state.get(action.meta.section).get(action.payload.type).push(Map({ title: '', years: '' })));
}

export function removeCarrier(state, action) {
  return state
    .setIn([action.meta.section, action.payload.type], state.get(action.meta.section).get(action.payload.type).delete(action.payload.index));
}

export function carrierToDefault(state, action) {
  let carriers = state.get(action.meta.section).get(action.payload.type);

  for (let i = carriers.size; i > 1; i -= 1) {
    carriers = carriers.pop();
  }
  return state
    .setIn([action.meta.section, action.payload.type], carriers);
}

export function updateCarrier(state, action) {
  const payload = action.payload;
  const section = action.meta.section;
  let finalState = state;

  if (!payload.value && payload.key === 'title' && payload.clearPlans) {
    let plans = finalState.get(section).get('plans');

    plans.map((item, i) => {
      plans = plans.setIn([i, 'selectedNetwork', 'networkId'], null);
      plans = plans.setIn([i, 'selectedCarrier', 'carrierId'], null);

      return true;
    });

    finalState = finalState.setIn([section, 'plans'], plans);
  }

  if (payload.key === 'title') finalState = finalState.setIn([section, 'rfpPlanNetworks'], fromJS({}));
  finalState = finalState.setIn([section, payload.type, payload.index, payload.key], payload.value);

  return finalState;
}

export function changeTier(state, action) {
  let arr = state.get(action.meta.section).get('plans');
  const tier = action.payload;

  arr.map((item, i) => {
    let contributionAmount = List([]);
    let currentRates = List([]);
    let renewalRates = List([]);
    let contributionEnrollment = List([]);
    let outOfStateAmountTiers = List([]);
    let outOfStateCurrentTiers = List([]);
    let outOfStateRenewalTiers = List([]);
    let outOfStateContributionEnrollment = List([]);

    for (let j = 0; j < tier; j += 1) {
      contributionAmount = contributionAmount.push(Map({ value: '' }));
      currentRates = currentRates.push(Map({ value: '' }));
      renewalRates = renewalRates.push(Map({ value: '' }));
      contributionEnrollment = contributionEnrollment.push(Map({ value: '' }));
      outOfStateAmountTiers = outOfStateAmountTiers.push(Map({ value: '' }));
      outOfStateCurrentTiers = outOfStateCurrentTiers.push(Map({ value: '' }));
      outOfStateRenewalTiers = outOfStateRenewalTiers.push(Map({ value: '' }));
      outOfStateContributionEnrollment = outOfStateContributionEnrollment.push(Map({ value: '' }));
    }

    arr = arr.set(i, item.merge({
      contributionAmount,
      currentRates,
      renewalRates,
      contributionEnrollment,
      outOfStateAmountTiers,
      outOfStateCurrentTiers,
      outOfStateRenewalTiers,
      outOfStateContributionEnrollment,
    }));

    return true;
  });

  return state
    .setIn([action.meta.section, 'tier'], tier)
    .setIn([action.meta.section, 'plans'], arr);
}

export function addPlan(state, action) {
  let finalState = state;
  const section = action.meta.section;
  const item = createPlan(finalState, section);
  const optionCount = finalState.get(section).get('optionCount') + 1;
  const max = finalState.get(section).get('maxOptions');
  if (max < optionCount) {
    return finalState
      .setIn([section, 'optionCount'], finalState.get(section).get('optionCount'));
  }

  finalState = finalState
    .setIn([section, 'plans'], state.get(section).get('plans').push(item))
    .setIn([section, 'optionCount'], state.get(section).get('optionCount') + 1);

  return finalState;
}

export function removePlan(state, action) {
  const finalState = state;
  let count = finalState.get(action.meta.section).get('optionCount');

  if (count > 1) {
    count -= 1;

    return finalState
      .deleteIn([action.meta.section, 'rfpPlanNetworks', count])
      .setIn([action.meta.section, 'plans'], finalState.get(action.meta.section).get('plans').pop())
      .setIn([action.meta.section, 'optionCount'], count);
  }

  return finalState;
}

export function plansToDefault(state, action) {
  const finalState = state;
  let plans = state.get(action.meta.section).get('plans');

  for (let i = plans.size; i > 1; i -= 1) {
    plans = plans.pop();
  }

  return finalState
    .setIn([action.meta.section, 'rfpPlanNetworks', fromJS({})])
    .setIn([action.meta.section, 'plans'], plans)
    .setIn([action.meta.section, 'plans', 0, 'name'], '')
    .setIn([action.meta.section, 'optionCount'], 1);
}

export function updatePlan(state, action) {
  const finalState = state;
  const data = action.payload;

  return finalState
    .setIn([action.meta.section, 'plans', data.index, data.key], data.value);
}

export function changeCurrentCarrier(state, action) {
  let data = state
    .setIn([action.meta.section, 'plans', action.payload.index, 'selectedCarrier'], fromJS({ carrierId: action.payload.carrierId }));
  if (action.payload.clearNetwork) {
    data = data.setIn([action.meta.section, 'plans', action.payload.index, 'selectedNetwork'], fromJS({}));
    data = data.setIn([action.meta.section, 'networksLoading', action.payload.index], true);
    data = data.deleteIn([action.meta.section, 'rfpPlanNetworks', action.payload.index]);
  }

  return data;
}

export function changeCurrentNetwork(state, action) {
  return state
    .setIn([action.meta.section, 'plans', action.payload.index, 'selectedNetwork'], fromJS({ networkId: action.payload.networkId }));
}

export function updatePlanTier(state, action) {
  let plans = state.get(action.meta.section).get('plans');
  if (action.payload.type) {
    plans = plans.setIn([action.payload.planIndex, action.payload.type, action.payload.tierIndex, 'value'], action.payload.value);
  }

  if (action.payload.outOfStateType) {
    plans = plans.setIn([action.payload.planIndex, 'outOfStateAmount'], action.payload.outOfState);
    plans = plans.setIn([action.payload.planIndex, 'outOfStateCurrent'], action.payload.outOfState);
    plans = plans.setIn([action.payload.planIndex, 'outOfStateRenewal'], action.payload.outOfState);
    plans = plans.setIn([action.payload.planIndex, 'outOfStateEnrollment'], action.payload.outOfState);
  }

  return state
    .setIn([action.meta.section, 'plans'], plans);
}

export function updatePlanBanded(state, action) {
  // section, index, path, value
  if (action.payload.path === 'rateType') {
    const rateType = (action.payload.value) ? types.RATE_TYPE_BANDED : types.RATE_TYPE_COMPOSITE;
    return state
      .setIn([action.meta.section, 'rateType'], fromJS(rateType));
  }
  const plans = state.get(action.meta.section).get('plans').toJS();
  plans[action.payload.index][action.payload.path].value = action.payload.value;
  return state
    .setIn([action.meta.section, 'plans'], fromJS(plans));
}

export function setError(state, action) {
  return state
    .setIn([action.meta.section, 'formErrors', action.payload.type], { msg: action.payload.msg, meta: action.payload.meta });
}

export function deleteError(state, action) {
  return state
    .deleteIn([action.meta.section, 'formErrors', action.payload.type]);
}

export function setValid(state, action) {
  return state
    .setIn([action.meta.section, 'complete'], action.payload);
}

export function setPageValid(state, action) {
  return state
    .setIn([action.meta.section, 'valid', action.payload.page], action.payload.valid);
}

export function setClientId(state, action) {
  return state
    .setIn(['client', 'id'], action.payload);
}

export function resetRfpState() {
  return initialRfpMasterState;
}

export function rfpPlansSaveSuccess(state, action) {
  const plans = action.payload;
  const section = action.meta.section;
  if (section === types.RFP_MEDICAL_SECTION || section === types.RFP_DENTAL_SECTION || section === types.RFP_VISION_SECTION) {
    let statePlans = state.get(action.meta.section).get('plans');
    for (let i = 0; i < plans.length; i += 1) {
      const plan = plans[i];
      statePlans = statePlans.setIn([i, 'selectedCarrier'], fromJS(plan.selectedCarrier));
      statePlans = statePlans.setIn([i, 'selectedNetwork'], fromJS(plan.selectedNetwork));
    }
    return state
      .setIn([action.meta.section, 'plans'], statePlans);
  } else if (section === types.RFP_LIFE_SECTION || section === types.RFP_STD_SECTION || section === types.RFP_LTD_SECTION) {
    let ancillaryState = state.get(action.meta.section);
    for (let i = 0; i < plans.length; i += 1) {
      const plan = plans[i];

      if (plan.planType === 'BASIC') {
        ancillaryState = ancillaryState.set('basicPlan', ancillaryState.get('basicPlan').mergeDeep(mappingLifeStdLtdClassesPlanState(plan, 'basicPlan', section)));
      } else if (plan.planType === 'VOLUNTARY') {
        ancillaryState = ancillaryState.set('voluntaryPlan', ancillaryState.get('voluntaryPlan').mergeDeep(mappingLifeStdLtdClassesPlanState(plan, 'voluntaryPlan', section)));
      }
    }

    return state
      .setIn([action.meta.section], ancillaryState);
  }

  return state;
}

export function rfpPlansGetError(state) {
  return state;
}

export function networksGetSuccess(state, action) {
  let finalState = state;
  const networks = action.payload.data;
  const index = action.payload.index;
  const plan = state.get(action.meta.section).get('plans').get(index).toJS();
  let networksList = [];
  if (networks && networks.length) {
    networksList = networks.map((item) => ({
      key: item.networkId,
      value: item.networkId,
      text: item.name,
    }));
  }
  if (networksList.length === 1 && !plan.selectedNetwork.networkId) {
    finalState = finalState.setIn([action.meta.section, 'plans', index, 'selectedNetwork'], fromJS({ networkId: networksList[0].value }));
  }

  finalState = finalState
    .deleteIn([action.meta.section, 'networksLoading', index])
    .setIn([action.meta.section, 'rfpPlanNetworks', index], fromJS(networksList));

  return finalState;
}

export function networksGetError() {
  return initialRfpMasterState;
}

export function fetchCarriers(state) {
  return state
    .setIn(['common', 'carriersLoaded'], false);
}

export function fetchCarriersSucceeded(state, action) {
  return state
    .setIn(['common', 'carriersLoaded'], true)
    .setIn(['medical', 'carrierList'], fromJS(action.payload.medical))
    .setIn(['dental', 'carrierList'], fromJS(action.payload.dental))
    .setIn(['vision', 'carrierList'], fromJS(action.payload.vision))
    .setIn(['life', 'carrierList'], fromJS(action.payload.life))
    .setIn(['std', 'carrierList'], fromJS(action.payload.std))
    .setIn(['ltd', 'carrierList'], fromJS(action.payload.ltd));
}

export function fetchRfpSucceeded(state, action) {
  const payload = action.payload;
  let newPayload = payload;
  if (payload.getIn(['medical', 'optionCount']) === null) {
    newPayload = payload.setIn(['medical', 'optionCount'], 1);
  }
  return state.merge(newPayload)
       .setIn(['common', 'rfpCreated'], true)
       .setIn(['common', 'pendingSave'], false);
}

export function fetchRfpFailed() {
  return initialRfpMasterState;
}

export function sendRfpToCarrierSuccess(state, action) {
  return state.merge(action.payload.data)
    .setIn(['common', 'requestError'], false)
    .setIn(['common', 'rfpCreated'], true);
}

export function rfpSubmittedSuccess(state) {
  return state
    .setIn(['common', 'requestError'], false);
}

export function sendRfpToCarrierError(state, action) {
  return state.merge(action.payload.data)
    .setIn(['common', 'requestError'], true)
    .setIn(['common', 'pendingSave'], false);
}

export function setPendingPlans(state) {
  return state
    .setIn(['common', 'pendingSave'], true);
}

export function updateAttribute(state, action) {
  return state
    .setIn([action.meta.section, 'attributes', action.payload.attribute], action.payload.value);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.CHANGE_SHOW_ERRORS: return changeShowErrors(state, action);
    case types.CHANGE_SECTION_FIELD: return changeSectionField(state, action);
    case types.ADD_CARRIER: return addCarrier(state, action);
    case types.REMOVE_CARRIER: return removeCarrier(state, action);
    case types.CARRIER_TO_DEFAULT: return carrierToDefault(state, action);
    case types.UPDATE_CARRIER: return updateCarrier(state, action);
    case types.CHANGE_TIER: return changeTier(state, action);
    case types.ADD_PLAN: return addPlan(state, action);
    case types.REMOVE_PLAN: return removePlan(state, action);
    case types.PLANS_TO_DEFAULT: return plansToDefault(state, action);
    case types.UPDATE_PLAN: return updatePlan(state, action);
    case types.CHANGE_CURRENT_CARRIER: return changeCurrentCarrier(state, action);
    case types.CHANGE_CURRENT_NETWORK: return changeCurrentNetwork(state, action);
    case types.UPDATE_PLAN_TIER: return updatePlanTier(state, action);
    case types.UPDATE_PLAN_BANDED: return updatePlanBanded(state, action);
    case formTypes.SET_ERROR: return setError(state, action);
    case formTypes.DELETE_ERROR: return deleteError(state, action);
    case formTypes.SET_VALID: return setValid(state, action);
    case formTypes.SET_PAGE_VALID: return setPageValid(state, action);
    case types.SET_CLIENT_ID: return setClientId(state, action);
    case types.RESET_RFP_STATE: return resetRfpState(state, action);
    case types.RFP_PLANS_SAVE_SUCCESS: return rfpPlansSaveSuccess(state, action);
    case types.RFP_PLANS_GET_ERROR: return rfpPlansGetError(state, action);
    case types.NETWORKS_GET_SUCCESS: return networksGetSuccess(state, action);
    case types.NETWORKS_GET_ERROR: return networksGetError(state, action);
    case types.FETCH_CARRIERS: return fetchCarriers(state, action);
    case types.FETCH_CARRIERS_SUCCEEDED: return fetchCarriersSucceeded(state, action);
    case types.FETCH_RFP_SUCCEEDED: return fetchRfpSucceeded(state, action);
    case types.FETCH_RFP_FAILED: return fetchRfpFailed(state, action);
    case types.SEND_RFP_TO_CARRIER_SUCCESS: return sendRfpToCarrierSuccess(state, action);
    case types.RFP_SUBMITTED_SUCCESS: return rfpSubmittedSuccess(state, action);
    case types.SEND_RFP_TO_CARRIER_ERROR: return sendRfpToCarrierError(state, action);
    case types.SET_PENDING_PLANS: return setPendingPlans(state, action);
    case types.UPDATE_ATTRIBUTE: return updateAttribute(state, action);
    default: return state;
  }
}

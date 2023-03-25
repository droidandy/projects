import * as types from './constants';
import * as formTypes from './formConstants';

/* Info */

export function addCarrier(section, type) {
  return {
    meta: {
      section,
    },
    type: types.ADD_CARRIER,
    payload: { type },
  };
}

export function removeCarrier(section, type, index) {
  return {
    meta: {
      section,
    },
    type: types.REMOVE_CARRIER,
    payload: { type, index },
  };
}

export function carrierToDefault(section, type) {
  return {
    meta: {
      section,
    },
    type: types.CARRIER_TO_DEFAULT,
    payload: { type },
  };
}

export function updateCarrier(section, type, key, value, index, clearPlans) {
  return {
    meta: {
      section,
    },
    type: types.UPDATE_CARRIER,
    payload: { type, key, value, index, clearPlans },
  };
}

/* Options */

export function addPlan(section) {
  return {
    meta: {
      section,
    },
    type: types.ADD_PLAN,
  };
}

export function removePlan(section) {
  return {
    meta: {
      section,
    },
    type: types.REMOVE_PLAN,
  };
}

export function plansToDefault(section) {
  return {
    meta: {
      section,
    },
    type: types.PLANS_TO_DEFAULT,
  };
}

export function updatePlan(section, key, value, index) {
  return {
    meta: {
      section,
    },
    type: types.UPDATE_PLAN,
    payload: { key, value, index },
  };
}

export function updatePlanTier(section, planIndex, type, outOfStateType, tierIndex, value, outOfState) {
  return {
    meta: {
      section,
    },
    type: types.UPDATE_PLAN_TIER,
    payload: { planIndex, type, outOfStateType, tierIndex, value, outOfState },
  };
}

export function updatePlanBanded(section, index, path, value) {
  return {
    meta: {
      section,
    },
    type: types.UPDATE_PLAN_BANDED,
    payload: { index, path, value },
  };
}

/* Files */

export function getPdf() {
  return {
    type: types.FETCH_RFP_PDF,
  };
}

export function addFile(section, name, files) {
  return {
    meta: {
      section,
    },
    type: types.ADD_FILE,
    payload: { name, files },
  };
}

export function removeFile(section, name, index) {
  return {
    meta: {
      section,
    },
    type: types.REMOVE_FILE,
    payload: { name, index },
  };
}

export function addPlanFile(section, files, index) {
  return {
    meta: {
      section,
    },
    type: types.ADD_PLAN_FILE,
    payload: { index, files },
  };
}

export function removePlanFile(section, index, fileIndex) {
  return {
    meta: {
      section,
    },
    type: types.REMOVE_PLAN_FILE,
    payload: { index, fileIndex },
  };
}

/* Client */

export function setClientId(id) {
  return {
    type: types.SET_CLIENT_ID,
    payload: id,
  };
}

/* Plans */

export function changeCarrier(section, carrierId, index, planType, clearNetwork) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CURRENT_CARRIER,
    payload: { carrierId, index, planType, clearNetwork },
  };
}

export function changeNetwork(section, networkId, index, planType) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CURRENT_NETWORK,
    payload: { networkId, index, planType },
  };
}

export function savePlans(section) {
  return {
    meta: {
      section,
    },
    type: types.RFP_PLANS_SAVE,
  };
}

export function saveAncillaryPlans(section, plans, rfpId) {
  return {
    meta: {
      section,
    },
    type: types.RFP_ANCILLARY_PLANS_SAVE,
    payload: { plans, rfpId },
  };
}

export function setPendingPlans() {
  return {
    type: types.SET_PENDING_PLANS,
  };
}

/* Common */

export function updatePlanLoaded(value) {
  return {
    type: types.UPDATE_PLANS_LOADED,
    payload: value,
  };
}

export function changeShowErrors(value) {
  return {
    type: types.CHANGE_SHOW_ERRORS,
    payload: value,
  };
}

export function updateForm(section, type, data) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_SECTION_FIELD,
    payload: { type, data },
  };
}

export function updateRateForm(section, planType, rateField, value) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_RATE_FIELD,
    payload: { planType, rateField, value },
  };
}

export function updateRateAgeForm(section, index, field, value) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_RATE_AGE_FIELD,
    payload: { index, field, value },
  };
}

export function changeAgesRowsCount(section, index, actionType, position) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_AGES_ROWS_COUNT,
    payload: { index, actionType, position },
  };
}

export function changeTier(section, data) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_TIER,
    payload: data,
  };
}

export function setError(section, type, msg, meta) {
  return {
    meta: {
      section,
    },
    type: formTypes.SET_ERROR,
    payload: { type, msg, meta },
  };
}

export function setValid(section, valid) {
  return {
    meta: {
      section,
    },
    type: formTypes.SET_VALID,
    payload: valid,
  };
}

export function setPageValid(section, page, valid) {
  return {
    meta: {
      section,
    },
    type: formTypes.SET_PAGE_VALID,
    payload: { page, valid },
  };
}

export function deleteError(section, type, meta) {
  return {
    meta: {
      section,
    },
    type: formTypes.DELETE_ERROR,
    payload: { type, meta },
  };
}

export function updateAttribute(section, attribute, value) {
  return {
    meta: {
      section,
    },
    type: types.UPDATE_ATTRIBUTE,
    payload: { attribute, value },
  };
}

export function getCarriers() {
  return {
    type: types.FETCH_CARRIERS,
  };
}

export function getRfp(id) {
  return {
    type: types.FETCH_RFP,
    id,
  };
}

export function resetRfpState() {
  return {
    type: types.RESET_RFP_STATE,
  };
}

export function sendRfp(payload) {
  return {
    type: types.SEND_RFP,
    payload,
  };
}

export function changeSelected(payload) {
  return {
    type: types.CHANGE_SELECTED,
    payload,
  };
}

/* Life & STD & LTD */

export function changeLifeStdLtdPlan(section, type, key, value) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_LIFE_STD_LTD_PLAN,
    payload: { type, key, value },
  };
}

export function changeLifeStdLtdPlanClass(section, type, key, value, index) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_LIFE_STD_LTD_PLAN_CLASS,
    payload: { type, key, value, index },
  };
}

export function addLifeStdLtdPlan(section, type) {
  return {
    meta: {
      section,
    },
    type: types.ADD_LIFE_STD_LTD_PLAN,
    payload: { type },
  };
}

export function removeLifeStdLtdPlan(section, type) {
  return {
    meta: {
      section,
    },
    type: types.REMOVE_LIFE_STD_LTD_PLAN,
    payload: { type },
  };
}

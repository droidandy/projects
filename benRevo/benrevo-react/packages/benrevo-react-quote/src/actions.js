/*
 *
 * PresentationPage actions
 *
 */

import * as types from './constants';

export function setClient(client) {
  return {
    type: types.SET_CLIENT,
    payload: client,
  };
}

export function inviteClient(email) {
  return {
    type: types.SEND_INVITE_CLIENT,
    email,
  };
}

export function getCarriers(force) {
  return {
    type: types.CARRIERS_GET,
    payload: { force },
  };
}

export function getQuotesCategory(section) {
  return {
    meta: {
      section,
    },
    type: types.GET_QUOTES_CATEGORY,
  };
}

export function getDocuments() {
  return {
    type: types.GET_DOCUMENTS,
  };
}

export function getFile(document) {
  return {
    type: types.GET_FILE,
    payload: document,
  };
}

export function changeLoad(section, data) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_LOAD,
    payload: data,
  };
}

export function changeLoadReset() {
  return {
    type: types.CHANGE_LOAD_RESET,
  };
}

export function getEnrollment() {
  return {
    type: types.ENROLLMENT_GET,
  };
}

export function getQuotesStatus(section) {
  return {
    meta: {
      section,
    },
    type: types.QUOTES_STATUS_GET,
  };
}

export function cancelEnrollment(section) {
  return {
    meta: {
      section,
    },
    type: types.ENROLLMENT_CANCEL,
  };
}

export function editEnrollment(section, edit) {
  return {
    meta: {
      section,
    },
    type: types.ENROLLMENT_EDIT,
    payload: edit,
  };
}

export function saveEnrollment(section) {
  return {
    meta: {
      section,
    },
    type: types.ENROLLMENT_SAVE,
  };
}

export function changeEnrollment(section, column, index, value) {
  return {
    meta: {
      section,
    },
    type: types.ENROLLMENT_CHANGE,
    payload: { column, index, value },
  };
}

export function changeContributionType(section, index, value) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CONTRIBUTION_TYPE,
    payload: { index, value },
  };
}

export function changeContribution(section, index, cIndex, value, key) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CONTRIBUTION,
    payload: { index, cIndex, value, key },
  };
}

export function cancelContribution(section) {
  return {
    meta: {
      section,
    },
    type: types.CANCEL_CONTRIBUTION,
  };
}

export function editContribution(section, edit, index) {
  return {
    meta: {
      section,
    },
    type: types.EDIT_CONTRIBUTION,
    payload: { edit, index },
  };
}

export function addOptionForNewProducts(option, section) {
  return {
    meta: {
      section,
    },
    type: types.ADD_OPTION_NEW_PRODUCTS,
    payload: {
      option,
    },
  };
}

export function refreshPresentationData(section, carrier, id, loading = true, kaiser, optionType, excludes) {
  return {
    meta: {
      section,
    },
    type: types.REFRESH_PRESENTATION_DATA,
    payload: { carrier, optionId: id, loading, kaiser, optionType, excludes },
  };
}

export function dataRefreshed(section, data, excludes) {
  return {
    meta: {
      section,
    },
    type: types.DATA_REFRESHED,
    payload: { data, excludes },
  };
}

export function getNetworks(section, id, carrier) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_NETWORK_GET,
    payload: { optionId: id, carrier },
  };
}

export function getCarrierNetworks(section, carrier, plans, optionId, showAllNetworks, kaiser) {
  return {
    meta: {
      section,
    },
    type: types.CARRIER_NETWORKS_GET,
    payload: { carrier, plans, optionId, showAllNetworks, kaiser },
  };
}

export function getContributions(section, optionId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_CONTRIBUTION_GET,
    payload: { optionId },
  };
}

export function saveContributions(section, optionId, index) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_CONTRIBUTION_SAVE,
    payload: { optionId, index },
  };
}

export function getRider(section, optionId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_RIDER_GET,
    payload: { optionId },
  };
}

export function saveRiderFee(section, administrativeFeeId, rfpQuoteOptionNetworkId, optionId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_RIDER_FEE_SAVE,
    payload: { administrativeFeeId, rfpQuoteOptionNetworkId, optionId },
  };
}

export function getRiderFee(section, carrierId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_RIDER_FEE_GET,
    payload: { carrierId },
  };
}

export function addNetwork(section, optionId, networkId, clientPlanId, multiMode) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_NETWORK_ADD,
    payload: { optionId, networkId, clientPlanId, multiMode },
  };
}

export function changeOptionNetwork(section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId, multiMode, isNetworkId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_NETWORK_CHANGE,
    payload: { optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId, multiMode, isNetworkId },
  };
}

export function deleteNetwork(section, optionId, networkId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_NETWORK_DELETE,
    payload: { optionId, networkId },
  };
}

export function openedOptionClear(section) {
  return {
    meta: {
      section,
    },
    type: types.OPENED_OPTION_CLEAR,
  };
}

export function dataRefreshError(section, error) {
  return {
    meta: {
      section,
    },
    type: types.DATA_REFRESH_ERROR,
    error,
  };
}

export function getPlans(section, networkIndex, multiMode, clearFilter) {
  return {
    meta: {
      section,
    },
    type: types.PLANS_GET,
    payload: { networkIndex, multiMode, clearFilter },
  };
}

export function setPlansFilter(section, filter) {
  return {
    meta: {
      section,
    },
    type: types.SET_PLANS_FILTER,
    payload: filter,
  };
}

export function clearPlansFilter(section) {
  return {
    meta: {
      section,
    },
    type: types.CLEAR_PLANS_FILTER,
  };
}

export function selectPlan(section, planId, networkId, index, multiMode, carrier) {
  return {
    meta: {
      section,
    },
    type: types.PLAN_SELECT,
    payload: { planId, networkId, index, multiMode, carrier },
  };
}

export function selectPlanLife(section, plan, rfpQuoteAncillaryOptionId, isSecond) {
  return {
    meta: {
      section,
    },
    type: types.PLAN_SELECT_LIFE,
    optionId: rfpQuoteAncillaryOptionId,
    payload: plan,
    isSecond,
  };
}

export function getOptions(section) {
  return {
    meta: {
      section,
    },
    type: types.OPTIONS_GET,
  };
}

export function getFinal(section) {
  return {
    meta: {
      section,
    },
    type: types.SELECTED_GET,
  };
}

export function submitFinal(section) {
  return {
    meta: {
      section,
    },
    type: types.SUBMIT_FINAL_SECTIONS,
  };
}

export function optionsSelect(section, id) {
  return {
    meta: {
      section,
    },
    type: types.OPTIONS_SELECT,
    payload: { optionId: id },
  };
}

export function optionsDelete(section, id) {
  return {
    meta: {
      section,
    },
    type: types.OPTIONS_DELETE,
    payload: { optionId: id },
  };
}

export function optionsUnSelect(section, id) {
  return {
    meta: {
      section,
    },
    type: types.OPTIONS_UNSELECT,
    payload: { optionId: id },
  };
}

export function changeCurrentPage(section, page) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CURRENT_PAGE,
    page,
  };
}

export function resetCurrentPage() {
  return {
    type: types.RESET_CURRENT_PAGE,
  };
}

export function optionCheck(section, option) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_CHECK,
    payload: option,
  };
}

export function getCompare(section) {
  return {
    meta: {
      section,
    },
    type: types.COMPARE_GET,
  };
}

export function compareFile(section) {
  return {
    meta: {
      section,
    },
    type: types.COMPARE_FILE,
  };
}

export function downloadQuote(section, kaiser) {
  return {
    meta: {
      section,
    },
    type: types.DOWNLOAD_QUOTE,
    payload: { kaiser },
  };
}

export function getProducts(section) {
  return {
    meta: {
      section,
    },
    type: types.QUOTES_GET,
  };
}

export function addPlan(section, newPlan, networkIndex, multiMode, status, rfpQuoteOptionNetworkId) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_ADD,
    payload: { newPlan, networkIndex, multiMode, status, rfpQuoteOptionNetworkId },
  };
}

export function addPlanLife(section, newPlan, networkIndex, multiMode, status, rfpQuoteId, rfpQuoteAncillaryOptionId) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_ADD_LIFE,
    payload: { newPlan, networkIndex, multiMode, status, rfpQuoteId, rfpQuoteAncillaryOptionId },
  };
}

export function addPlanVol(section, networkIndex, status, rfpQuoteId, rfpQuoteAncillaryOptionId) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_ADD_VOL,
    payload: { networkIndex, status, rfpQuoteId, rfpQuoteAncillaryOptionId },
  };
}

export function editPlan(section, plan, rfpQuoteNetworkId, networkIndex, multiMode) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_EDIT,
    payload: { plan, rfpQuoteNetworkId, networkIndex, multiMode },
  };
}

export function editPlanLife(section, plan, rfpQuoteNetworkId, networkIndex, multiMode) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_EDIT_LIFE,
    payload: { plan, rfpQuoteNetworkId, networkIndex, multiMode },
  };
}

export function editPlanVol(section, plan, rfpQuoteNetworkId, networkIndex, multiMode) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_EDIT_VOL,
    payload: { plan, rfpQuoteNetworkId, networkIndex, multiMode },
  };
}

export function deletePlan(section, rfpQuoteNetworkPlanId, rfpQuoteNetworkId, networkIndex, multiMode) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_DELETE,
    payload: { rfpQuoteNetworkPlanId, rfpQuoteNetworkId, networkIndex, multiMode },
  };
}

export function updatePlanField(section, name, value, part, valName, status, planIndex, externalRX) {
  return {
    meta: {
      section,
    },
    type: types.ALTERNATIVE_PLAN_VALUE_CHANGE,
    payload: { name, value, part, valName, status, planIndex, externalRX },
  };
}

export function saveCurrentPlan(section, plan, index, networkIndex, multiMode, externalRX) {
  return {
    meta: {
      section,
    },
    type: types.SAVE_CURRENT_PLAN,
    payload: { plan, index, networkIndex, multiMode, externalRX },
  };
}

export function getComparison() {
  return {
    meta: {},
    type: types.COMPARISON_GET,
  };
}

export function getNetworksForCompare(section) {
  return {
    meta: { section },
    type: types.OPTION_COMPARE_NETWORKS_GET,
  };
}

export function getDisclaimer(section, rfpQuoteOptionId) {
  return {
    meta: {
      section,
    },
    payload: { rfpQuoteOptionId },
    type: types.DISCLAIMER_GET,
  };
}

export function setCurrentNetworkName(section, networkName) {
  return {
    meta: {
      section,
    },
    payload: { networkName },
    type: types.SET_CURRENT_NETWORK_NAME,
  };
}

export function setStateAlternativesPlans(section, stateAlternativesPlans) {
  return {
    meta: {
      section,
    },
    payload: { stateAlternativesPlans },
    type: types.SET_STATE_ALTERNATIVE_PLANS,
  };
}

export function changeExternalProducts(type, value) {
  return {
    payload: { type, value },
    type: types.EXTERNAL_PRODUCTS_SELECT,
  };
}

export function createDTPClearValue() {
  return {
    type: types.CREATE_DTP_CLEAR_VALUE,
  };
}


export function getDTPClearValueStatus() {
  return {
    type: types.GET_CLEAR_VALUE_STATUS,
  };
}

export function downloadPlanBenefitsSummary(summaryFileLink, planName) {
  return {
    payload: { summaryFileLink, planName },
    type: types.DOWNLOAD_PLAN_BENEFITS_SUMMARY,
  };
}

export function downloadLifeQuote(quotes) {
  return {
    type: types.DOWNLOAD_LIFE_QUOTE,
    payload: quotes,
  };
}

export function downloadModLetter() {
  return {
    type: types.DOWNLOAD_MOD_LETTER,
  };
}

export function downloadPPT() {
  return {
    type: types.DOWNLOAD_PPT,
  };
}

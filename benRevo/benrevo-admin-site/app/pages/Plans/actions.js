/*
 *
 * Plans actions
 *
 */

import * as types from './constants';

export function downloadFile(file) {
  return {
    type: types.DOWNLOAD_FILE,
    payload: file,
  };
}

export function previewQuote(data) {
  return {
    type: types.PREVIEW_QUOTE,
    payload: data,
  };
}

export function uploadQuote(data) {
  return {
    type: types.UPLOAD_QUOTE,
    payload: data,
  };
}

export function declineQuote(data) {
  return {
    type: types.DECLINE,
    payload: data,
  };
}

export function declineApprove() {
  return {
    type: types.DECLINE_APPROVE,
  };
}

export function uploadDentalQuote(type, files, category, actionType) {
  return {
    type: types.UPLOAD_DENTAL_QUOTE,
    payload: { type, files, category, actionType },
  };
}

export function giveAccessToClient(brokerId, clientId) {
  return {
    type: types.GIVE_ACCESS_TO_CLIENT,
    payload: { brokerId, clientId },
  };
}

export function changeSelectedClient(path, value) {
  return {
    type: types.CHANGE_SELECTED_CLIENT,
    payload: { path, value },
  };
}

export function getFiles() {
  return {
    type: types.FILES_GET,
  };
}

export function getHistory() {
  return {
    type: types.HISTORY_GET,
  };
}

export function createNewPlan(section) {
  return {
    meta: { section },
    type: types.PLAN_CREATE,
  };
}

export function updatePlanField(section, index1, index2, valType, value, rxFlag) {
  return {
    meta: {
      section,
    },
    type: types.PLAN_FIELD_UPDATE,
    payload: { index1, index2, valType, value, rxFlag },
  };
}

export function getCarrierHistory(section) {
  return {
    meta: {
      section,
    },
    type: types.GET_CARRIER_HISTORY,
  };
}

export function updatePlansPage() {
  return {
    type: types.UPDATE_PLANS_PAGE,
  };
}

export function getPlan(plans) {
  return {
    type: types.PLAN_GET,
    payload: plans,
  };
}

export function getClientPlans(clientId) {
  return {
    type: types.CLIENT_PLANS_GET,
    payload: clientId,
  };
}

export function changeCurrentCarrier(section, carrierId, index, planType) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CURRENT_CARRIER,
    payload: { carrierId, index, planType },
  };
}

export function changeCurrentNetwork(section, networkId, index, carrierId, planType) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_CURRENT_NETWORK,
    payload: { networkId, index, carrierId, planType },
  };
}

export function getClientTeam(clientId) {
  return {
    type: types.CLIENT_TEAM_GET,
    payload: clientId,
  };
}

export function saveClientTeam() {
  return {
    type: types.CLIENT_TEAM_SAVE,
  };
}

export function createAccounts(id) {
  return {
    type: types.CLIENT_TEAM_CREATE_ACCOUNTS,
    payload: id,
  };
}

export function changebrClientTeam(memIndex, property, value) {
  return {
    type: types.BR_CLIENT_TEAM_CHANGE,
    payload: { memIndex, property, value },
  };
}

export function addbrClientTeam(id) {
  return {
    type: types.BR_CLIENT_TEAM_ADD,
    payload: id,
  };
}

export function removebrClientTeam(memIndex) {
  return {
    type: types.BR_CLIENT_TEAM_REMOVE_LOCAL,
    payload: memIndex,
  };
}

export function moveClient(fromBrokerId, toBrokerId, clientId, newBroker, moveReason) {
  return {
    type: types.MOVE_CLIENT,
    payload: { fromBrokerId, toBrokerId, clientId, newBroker, moveReason },
  };
}

export function changeReason(reason) {
  return {
    type: types.MOVE_CLIENT_REASON_CHANGE,
    payload: reason,
  };
}

export function changeMoveCheck(checked) {
  return {
    type: types.MOVE_CLIENT_CHECK_CHANGE,
    payload: checked,
  };
}

export function changeBrokerage(brokerage) {
  return {
    type: types.MOVE_CLIENT_BROKERAGE_CHANGE,
    payload: brokerage,
  };
}


/*
 * Plan Submit
 *
 */


export function saveSummary(value, section) {
  return {
    type: types.SUMMARY_SAVE,
    payload: { value, section },
  };
}

export function getDates() {
  return {
    type: types.DATES_GET,
  };
}

export function changeQuoteType(category, value) {
  return {
    meta: {
      section: category,
    },
    type: types.CHANGE_QUOTE_TYPE,
    value,
  };
}

export function getSummary() {
  return {
    type: types.SUMMARY_GET,
  };
}

export function changeOption1Group(category, planId, networkGroup) {
  return {
    meta: {
      section: category,
    },
    type: types.CHANGE_OPTION1_GROUP,
    payload: { planId, networkGroup },
  };
}
export function changeOption1(category, planId, rfpQuoteNetwork, optionId) {
  return {
    meta: {
      section: category,
    },
    type: types.CHANGE_OPTION1,
    payload: { planId, rfpQuoteNetwork, optionId },
  };
}

export function changeOption1Match(category, planId, rfpQuoteNetwork, optionId) {
  return {
    meta: {
      section: category,
    },
    type: types.CHANGE_OPTION1_MATCH,
    payload: { planId, rfpQuoteNetwork, optionId },
  };
}

export function getQuoteNetworks(category) {
  return {
    type: types.QUOTE_NETWORKS_GET,
    payload: (category) ? [category] : null,
  };
}

export function saveOption1() {
  return {
    type: types.OPTION1_SAVE,
  };
}

export function changeUsage(section, value) {
  return {
    type: types.CHANGE_USAGE,
    meta: {
      section,
    },
    payload: value,
  };
}

export function sendNotification() {
  return {
    type: types.SEND_NOTIFICATION,
  };
}

export function approveOnBoarding() {
  return {
    type: types.APPROVE_ON_BOARDING,
  };
}

export function getDifference() {
  return {
    type: types.DIFFERENCE_GET,
  };
}

export function changeClientStatus(newStatus, clientId) {
  return {
    type: types.CHANGE_CLIENT_STATUS,
    payload: { newStatus, clientId },
  };
}

export function deleteQuote(quoteType) {
  return {
    type: types.DELETE_QUOTE,
    payload: { quoteType },
  };
}

export function updateSelectedPlan(index, id, key, value) {
  return {
    type: types.UPDATE_SELECTED_PLAN,
    payload: { index, id, key, value },
  };
}

export function resetPlanChanges(index) {
  return {
    type: types.RESET_PLAN_CHANGES,
    payload: index,
  };
}

export function gaClientTeamAdd(gaId) {
  return {
    type: types.GA_CLIENT_TEAM_ADD,
    payload: gaId,
  };
}

export function gaClientTeamAddMember(index) {
  return {
    type: types.GA_CLIENT_TEAM_ADD_MEMBER,
    payload: index,
  };
}

export function gaClientTeamRemoveMember(outerIndex, innerIndex) {
  return {
    type: types.GA_CLIENT_TEAM_REMOVE_MEMBER,
    payload: { outerIndex, innerIndex },
  };
}

export function gaClientTeamChangeMember(outerIndex, innerIndex, type, value) {
  return {
    type: types.GA_CLIENT_TEAM_CHANGE_MEMBER,
    payload: { outerIndex, innerIndex, type, value },
  };
}

export function saveContribution() {
  return {
    type: types.SAVE_CONTRIBUTION,
  };
}

export function changeSelectedQuoteType(quoteType) {
  return {
    type: types.CHANGE_SELECTED_QUOTE_TYPE,
    payload: quoteType,
  };
}

export function uploadMedicalExists(fileInfo) {
  return {
    type: types.UPLOAD_MEDICAL_EXISTS,
    payload: fileInfo,
  };
}

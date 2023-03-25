import * as types from './constants';

export function changePlanField(section, index, key, type, valueKey, value, planType) {
  return {
    meta: {
      section,
    },
    type: types.CHANGE_PLAN_FIELD,
    payload: {
      index,
      type,
      key,
      valueKey,
      value,
      planType,
    },
  };
}

export function selectBenefits(section, planIndex, select) {
  return {
    meta: {
      section,
    },
    type: types.SELECT_BENEFITS,
    payload: {
      planIndex,
      select,
    },
  };
}

export function getBrokerage() {
  return {
    type: types.BROKERAGE_GET,
  };
}

export function getGA() {
  return {
    type: types.GA_GET,
  };
}

export function downloadOptimizer() {
  return {
    type: types.DOWNLOAD_OPTIMIZER,
  };
}

export function getRaters() {
  return {
    type: types.RATERS_GET,
  };
}

export function getQuotePlans() {
  return {
    type: types.QUOTE_PLANS_GET,
  };
}

export function getHistory() {
  return {
    type: types.HISTORY_GET,
  };
}

export function changeRater(id) {
  return {
    type: types.CHANGE_RATER,
    payload: id,
  };
}

export function changeDiscount(product, select) {
  return {
    type: types.CHANGE_DISCOUNT,
    payload: { product, select },
  };
}

export function changeNote(note) {
  return {
    type: types.CHANGE_NOTE,
    payload: note,
  };
}

export function sendToRater(note) {
  return {
    type: types.SEND_TO_RATER,
    payload: note,
  };
}

export function getBrokerTeam(brokerId, contactsType) {
  return {
    type: types.BROKER_TEAM_GET,
    payload: {
      brokerId,
      contactsType,
    },
  };
}

export function setSelectedBrokerTeam(data, contactsType) {
  return {
    type: types.SET_SELECTED_BROKER_TEAM,
    payload: {
      data,
      contactsType,
    },
  };
}

export function resetDeletedList() {
  return {
    type: types.RESET_DELETED_LIST,
  };
}

export function setSelectedBroker(broker, brokerType, contactsType) {
  return {
    type: types.SET_SELECTED_BROKER,
    payload: {
      broker,
      brokerType,
      contactsType,
    },
  };
}

export function resetSelectedGA() {
  return {
    type: types.RESET_SELECTED_GA,
  };
}

export function selectBrokerTeamMember(id, selected, contactsType, index) {
  return {
    type: types.SELECT_BROKER_TEAM_MEMBER,
    payload: {
      id,
      selected,
      contactsType,
      index,
    },
  };
}

export function removeMemberFromSelectedList(id, contactsType, filterType) {
  return {
    type: types.REMOVE_BROKER_TEAM_MEMBER_FROM_LIST,
    payload: {
      id,
      contactsType,
      filterType,
    },
  };
}

export function filterBrokerTeam(selected, contactsType, filterType) {
  return {
    type: types.FILTER_BROKER_TEAM,
    payload: {
      selected,
      contactsType,
      filterType,
    },
  };
}

export function saveClientTeam() {
  return {
    type: types.SAVE_CLIENT_TEAM,
  };
}

export function createBroker() {
  return {
    type: types.CREATE_BROKER,
  };
}

export function addNewContactField(contactType) {
  return {
    type: types.ADD_NEW_CONTACT_FIELD,
    payload: {
      contactType,
    },
  };
}

export function addBrokerContactsField(contactType, index, fields) {
  return {
    type: types.ADD_BROKER_CONTACT_FIELD,
    payload: {
      contactType,
      index,
      fields,
    },
  };
}

export function removeBrokerContactsField(index, contactType) {
  return {
    type: types.REMOVE_BROKER_CONTACT_FIELD,
    payload: {
      index,
      contactType,
    },
  };
}

export function updateBrokerContactsFields(data, brokerId, index, contactType) {
  return {
    type: types.UPDATE_BROKER_CONTACT_FIELDS,
    payload: {
      data,
      brokerId,
      index,
      contactType,
    },
  };
}

export function changeNewBroker(name, value) {
  return {
    type: types.CHANGE_NEW_BROKER,
    payload: {
      name,
      value,
    },
  };
}

export function saveClient() {
  return {
    type: types.SAVE_CLIENT,
  };
}

export function changeSent(sent) {
  return {
    type: types.CHANGE_SENT,
    payload: sent,
  };
}

export function setReadyToSave(condition) {
  return {
    type: types.SET_READY_TO_SAVE,
    payload: {
      condition,
    },
  };
}

export function setProducerValue(value) {
  return {
    type: types.SET_PRODUCER_VALUE,
    payload: {
      value,
    },
  };
}

export function getClientTeam() {
  return {
    type: types.GET_CLIENT_TEAM,
  };
}

export function getSummary() {
  return {
    type: types.SUMMARY_GET,
  };
}

export function changeSummary(value, section) {
  return {
    type: types.CHANGE_SUMMARY,
    payload: { value, section },
  };
}

export function saveSummary() {
  return {
    type: types.SUMMARY_SAVE,
  };
}

export function sendToBroker() {
  return {
    type: types.SEND_TO_BROKER,
  };
}

export function changeSentBroker(sent) {
  return {
    type: types.CHANGE_SENT_BROKER,
    payload: sent,
  };
}

export function resetNewContacts() {
  return {
    type: types.RESET_NEW_CONTACTS,
  };
}

export function createClientPlans(section, rfpIds) {
  return {
    meta: {
      section,
    },
    type: types.CREATE_CLIENT_PLANS,
    payload: { rfpIds },
  };
}

export function getRateBank(quoteType) {
  return {
    type: types.RATE_BANK_GET,
    payload: { quoteType },
  };
}

export function sendToBank(data) {
  return {
    type: types.SEND_RATE_BANK,
    payload: data,
  };
}

export function changeEditTable(toogleEdit) {
  return {
    type: types.CHANGE_EDIT_TABLE,
    payload: toogleEdit,
  };
}

export function rateBankSuccess(rateBankData) {
  return {
    type: types.RATE_BANK_SUCCESS,
    payload: rateBankData,
  };
}

export function getHistoryBank(quoteType) {
  return {
    type: types.RATE_HISTORY_GET,
    payload: { quoteType },
  };
}
export function changeEditBadget(toogleEditB) {
  return {
    type: types.CHANGE_EDIT_BUDGET,
    payload: toogleEditB,
  };
}


export function editBudgetInput(name, value) {
  return {
    type: types.EDITED_BUDGET_INPUT,
    payload: { name, value },
  };
}

export function saveBudgetData(budgetData) {
  return {
    type: types.SAVE_BUDGET_DATA,
    payload: budgetData,
  };
}


export function saveTableData(tableData) {
  return {
    type: types.SAVE_TABLE_DATA,
    payload: tableData,
  };
}

export function editTableInput(id, value) {
  return {
    type: types.EDITED_TABLE_INPUT,
    payload: { id, value },
  };
}

export function changeSentBank(sent) {
  return {
    type: types.CHANGE_SENT_BANK,
    payload: sent,
  };
}

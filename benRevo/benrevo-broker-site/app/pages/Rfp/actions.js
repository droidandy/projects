import * as types from './constants';

export function changeRfpSent(value) {
  return {
    type: types.CHANGE_RFP_SENT,
    payload: value,
  };
}

export function selectClientsCarrier(carrier, section, products) {
  return {
    type: types.SELECT_CLIENTS_CARRIER,
    payload: { carrier, section, products },
  };
}

export function getCarrierEmailsList() {
  return {
    type: types.GET_CARRIER_EMAILS,
  };
}

export function changeEmails(carrier, emails) {
  return {
    type: types.CHANGE_EMAILS,
    payload: { carrier, emails },
  };
}

export function changeSelect(carrierId, product, selected) {
  return {
    type: types.CHANGE_SELECT,
    payload: { carrierId, product, selected },
  };
}

export function getCurrentOption(section, optionId) {
  return {
    meta: {
      section,
    },
    type: types.GET_CURRENT_OPTION,
    payload: { optionId },
  };
}

export function getCurrentAncillaryOption(section, simpleSection, isRenewal, optionId) {
  return {
    meta: {
      section,
    },
    type: types.GET_CURRENT_ANCILLARY_OPTION,
    payload: { simpleSection, isRenewal, optionId },
  };
}

export function getPlans(section, data, isRenewal) {
  return {
    meta: {
      section,
    },
    type: types.PLANS_GET,
    payload: { data, isRenewal },
  };
}

export function saveCurrentOption(section, optionId, isRenewal) {
  return {
    meta: {
      section,
    },
    type: types.SAVE_CURRENT_OPTION,
    payload: { optionId, isRenewal },
  };
}

export function saveCurrentAncillaryOption(section, isRenewal, ancillaryType, simpleSection, optionId) {
  return {
    meta: {
      section,
    },
    type: types.SAVE_CURRENT_ANCILLARY_OPTION,
    payload: {
      isRenewal,
      ancillaryType,
      simpleSection,
      optionId,
    },
  };
}

export function savePlans(section, isRenewal) {
  return {
    meta: {
      section,
    },
    type: types.PLANS_SAVE,
    payload: { isRenewal },
  };
}

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

export function changePage(page) {
  return {
    type: types.CHANGE_PAGE,
    payload: {
      page,
    },
  };
}

export function clearCarrierData() {
  return {
    type: types.CLEAR_CARRIER_DATA,
  };
}

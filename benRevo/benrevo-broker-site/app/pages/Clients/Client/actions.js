import * as types from './../constants';

export function getValidationStatus(clientId) {
  return {
    type: types.GET_VALIDATE,
    payload: clientId,
  };
}

export function getMarketingStatusList(clientId) {
  return {
    type: types.GET_MARKETING_STATUS_LIST,
    payload: clientId,
  };
}

export function getBrokerPrograms(brokerId) {
  return {
    type: types.GET_PROGRAMS,
    payload: brokerId,
  };
}

export function selectClientsCarrier(carrier, section) {
  return {
    type: types.SELECT_CLIENTS_CARRIER,
    payload: { carrier, section },
  };
}

export function updateCarrierList(clientId, section) {
  return {
    type: types.SAVE_MARKETING_STATUS_LIST,
    payload: { clientId },
    meta: {
      section,
    },
  };
}

export function updateMarketingStatusItem(itemId, marketingStatus, clientId) {
  return {
    type: types.SAVE_MARKETING_STATUS_LIST_ITEM,
    payload: { itemId, marketingStatus, clientId },
  };
}

export function deleteCarrier(clientId, carrierItem, section) {
  return {
    type: types.DELETE_CARRIE_ITEM,
    payload: { clientId, carrierItem },
    meta: {
      section,
    },
  };
}

export function getCLSAQuote(zip, number, age, programId, section) {
  return {
    type: types.GET_CLSA_QUOTE,
    payload: {
      zip,
      number,
      age,
      programId,
      section,
    },
  };
}

export function getClientAttributes() {
  return {
    type: types.GET_CLIENT_ATTRIBUTES,
  };
}

export function setClientAttributesCall(payload) {
  return {
    type: types.SET_CLIENT_ATTRIBUTES_CALL,
    payload,
  };
}

export function resetZip() {
  return {
    type: types.RESET_ZIP,
  };
}

export function zipSuccessCall(payload) {
  return {
    type: types.ZIP_SUCCESS_CALL,
    payload,
  };
}

export function clsaModalOpen() {
  return {
    type: types.CLSA_MODAL_OPEN,
  };
}

export function clsaModalClose() {
  return {
    type: types.CLSA_MODAL_CLOSE,
  };
}

export function getNextCLSA(programId, section) {
  return {
    type: types.GET_NEXT_CLSA,
    payload: { programId, section },
  };
}

export function checkUHCAction(section, id) {
  return {
    type: types.CHECK_UHC,
    payload: { section, id },
  };
}

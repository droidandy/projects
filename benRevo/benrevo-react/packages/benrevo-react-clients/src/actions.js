import {
  FETCH_CLIENTS,
  FETCH_CLIENT,
  SELECT_CLIENT,
  UPDATE_CLIENT,
  SAVE_CLIENT,
  QUOTE_NEW_CLIENT,
  CLIENTS_SORT,
  SET_RFP_ROUTING_STATUS,
  EXPORT_CLIENT,
  IMPORT_CLIENT,
  CHANGE_SELECTED_PRODUCT,
  CHANGE_VIRGIN_COVERAGE,
  RESET_CLIENTS,
  RESET_CLIENT_INFO,
} from './constants';

export function resetClients() {
  return {
    type: RESET_CLIENTS,
  };
}

export function resetClientInfo() {
  return {
    type: RESET_CLIENT_INFO,
  };
}

export function updateClient(name, value) {
  return {
    type: UPDATE_CLIENT,
    payload: { name, value },
  };
}

export function clientsSort(prop, order) {
  return {
    type: CLIENTS_SORT,
    payload: { prop, order },
  };
}

export function selectClient(client) {
  return {
    type: SELECT_CLIENT,
    payload: client,
  };
}

export function quoteNewClient(brokerId) {
  return {
    type: QUOTE_NEW_CLIENT,
    payload: { brokerId },
  };
}

export function saveNewClient() {
  return {
    type: SAVE_CLIENT,
  };
}

export function exportClient() {
  return {
    type: EXPORT_CLIENT,
  };
}

export function importClient(file, name, override, brokerId) {
  return {
    type: IMPORT_CLIENT,
    payload: { file, name, override, brokerId },
  };
}

export function sendClients(payload) {
  return {
    type: FETCH_CLIENTS,
    payload,
  };
}

export function getClient(clientId) {
  return {
    type: FETCH_CLIENT,
    payload: { clientId },
  };
}

export function setRouteError(status, type) {
  return {
    type: SET_RFP_ROUTING_STATUS,
    payload: { status, type },
  };
}

export function changeSelectedProducts(type, value) {
  return {
    type: CHANGE_SELECTED_PRODUCT,
    payload: { type, value },
  };
}

export function changeVirginCoverage(type, value) {
  return {
    type: CHANGE_VIRGIN_COVERAGE,
    payload: { type, value },
  };
}

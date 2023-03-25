import * as types from './constants';

export function changeCarrier(carrier) {
  return {
    type: types.CHANGE_CARRIERS,
    payload: carrier,
  };
}

export function changeBrokers(broker) {
  return {
    type: types.CHANGE_BROKERS,
    payload: broker,
  };
}

export function changeClients(client) {
  return {
    type: types.CHANGE_CLIENTS,
    payload: client,
  };
}

export function getCarrier() {
  return {
    type: types.LOAD_CARRIERS,
  };
}

export function getBrokers() {
  return {
    type: types.LOAD_BROKERS,
  };
}

export function getClients(brokerId) {
  return {
    type: types.LOAD_CLIENTS,
    payload: brokerId,
  };
}

export function setRouteError(error) {
  return {
    type: types.SET_ROUTE_ERROR,
    payload: { error },
  };
}


export function updateClient(key, value) {
  return {
    type: types.UPDATE_CLIENT,
    payload: { key, value },
  };
}

export function changeCurrentBroker(broker) {
  return {
    type: types.CHANGE_CURRENT_BROKER,
    payload: { broker },
  };
}

export function changeClientMembers(members) {
  return {
    type: types.CHANGE_CURRENT_MEMBERS,
    payload: { members },
  };
}

export function getClientsByName(searchText) {
  return {
    type: types.GET_CLIENTS_BY_NAME,
    payload: { searchText },
  };
}

export function updateClientNameSearchText(text) {
  return {
    type: types.UPDATE_CLIENT_NAME_SEARCH_TEXT,
    payload: { text },
  };
}

import * as types from './constants';

export function getClients(filter) {
  return {
    type: types.CLIENTS_GET,
    payload: filter,
  };
}

export function getBrokerVolume() {
  return {
    type: types.BROKER_VOLUME_GET,
  };
}

export function getMarketPositions() {
  return {
    type: types.MARKET_POSITIONS_GET,
  };
}

export function getQuoteDifference() {
  return {
    type: types.QUOTE_DIFFERENCE_GET,
  };
}

export function changeFilter(type, value) {
  return {
    type: types.CHANGE_FILTER,
    payload: { type, value },
  };
}

export function changeVolumeGroup(value) {
  return {
    type: types.CHANGE_VOLUME_GROUP,
    payload: value,
  };
}

export function changeMarketProduct(value) {
  return {
    type: types.CHANGE_MARKET_PRODUCT,
    payload: value,
  };
}

export function changeIncumbentProduct(value) {
  return {
    type: types.CHANGE_INCUMBENT_PRODUCT,
    payload: value,
  };
}

export function changeVolumeProduct(value) {
  return {
    type: types.CHANGE_VOLUME_PRODUCT,
    payload: value,
  };
}

export function clearFilter() {
  return {
    type: types.CLEAR_FILTER,
  };
}

export function getFilters(product) {
  return {
    type: types.FILTERS_GET,
    payload: { product },
  };
}

export function getProbabilityStats(product) {
  return {
    type: types.GET_PROBABILITY_STATS,
    payload: product,
  };
}

export function getClientsAtRisk(product) {
  return {
    type: types.GET_CLIENTS_AT_RISK,
    payload: product,
  };
}

export function getUpcomingRenewalClients(product) {
  return {
    type: types.GET_UPCOMING_RENEWAL,
    payload: product,
  };
}

export function changeProbabilityProduct(product) {
  return {
    type: types.CHANGE_PROBABILITY_PRODUCT,
    payload: product,
  };
}

export function getFunnelData(value) {
  return {
    type: types.GET_FUNNEL_DATA,
    payload: value,
  };
}

export function getTopClients() {
  return {
    type: types.TOP_CLIENTS_GET,
  };
}

export function toggleTopClient(client, check) {
  return {
    type: types.TOGGLE_TOP_CLIENT,
    payload: { client, check },
  };
}

export function changeQY(value) {
  return {
    type: types.CHANGE_QUARTER_YEAR,
    payload: value,
  };
}

import * as types from './constants';

export function getClients(filter) {
  return {
    type: types.CLIENTS_GET,
    payload: filter,
  };
}

export function changeFilter(type, value) {
  return {
    type: types.CHANGE_CLIENTS_FILTER,
    payload: { type, value },
  };
}

export function setFilter(filters) {
  return {
    type: types.SET_FILTER,
    payload: filters,
  };
}

export function changeClientsSort(prop, order) {
  return {
    type: types.CHANGE_CLIENTS_SORT,
    payload: { prop, order },
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

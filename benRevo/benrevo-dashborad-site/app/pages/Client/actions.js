import * as types from './constants';

export function getClients(filter) {
  return {
    type: types.CLIENTS_GET,
    payload: filter,
  };
}

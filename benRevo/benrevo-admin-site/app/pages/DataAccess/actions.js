/*
 *
 * DataAccess actions
 *
*/

import * as types from './constants';

export function getGaClients() {
  return {
    type: types.GA_CLIENTS_GET,
  };
}

export function removeAccessToClient(clientId) {
  return {
    type: types.REMOVE_ACCESS_TO_CLIENT,
    payload: { clientId },
  };
}

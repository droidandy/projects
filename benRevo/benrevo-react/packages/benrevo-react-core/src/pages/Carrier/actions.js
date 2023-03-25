import {
  FETCH_CLIENTS,
} from './constants';

export function sendClients(payload) {
  return {
    type: FETCH_CLIENTS,
    payload,
  };
}

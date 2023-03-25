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

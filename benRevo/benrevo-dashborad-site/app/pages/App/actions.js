/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import * as types from './constants';
import { CHECK_VERSION } from '../../utils/version';

export function clearStore() {
  return {
    type: types.CLEAR,
  };
}

export function setCheckingRole(checking) {
  return {
    type: types.CHECKING_ROLE,
    payload: checking,
  };
}

export function getPersons() {
  return {
    type: types.PERSONS_GET,
  };
}

export function getCarriers() {
  return {
    type: types.CARRIERS_GET,
  };
}


export function getBrokers() {
  return {
    type: types.BROKERS_GET,
  };
}

export function toggleMobileNav() {
  return {
    type: types.TOGGLE_MOBILE_NAV,
  };
}

export function checkVersion(status) {
  return {
    type: CHECK_VERSION,
    status,
  };
}

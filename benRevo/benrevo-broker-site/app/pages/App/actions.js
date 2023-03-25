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

import { CHECK_VERSION } from '@benrevo/benrevo-react-core';
import * as types from './constants';

export function checkingRole(checking) {
  return {
    type: types.CHECKING_ROLE,
    payload: checking,
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

export function getCarriers() {
  return {
    type: types.GET_ALL_CARRIERS,
  };
}

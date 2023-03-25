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

import {
  TOGGLE_MOBILE_NAV,
  CHECKING_ROLE,
  OPEN_FEEDBACK_MODAL,
  CLOSE_FEEDBACK_MODAL,
} from './constants';
import { CHECK_VERSION } from '../../utils/version';

export function checkingRole(checking) {
  return {
    type: CHECKING_ROLE,
    payload: checking,
  };
}

export function toggleMobileNav() {
  return {
    type: TOGGLE_MOBILE_NAV,
  };
}

export function checkVersion(status) {
  return {
    type: CHECK_VERSION,
    status,
  };
}

export function openFeedbackModal() {
  return {
    type: OPEN_FEEDBACK_MODAL,
  };
}

export function closeFeedbackModal() {
  return {
    type: CLOSE_FEEDBACK_MODAL,
  };
}

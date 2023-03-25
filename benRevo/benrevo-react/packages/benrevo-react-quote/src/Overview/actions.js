/*
 *
 * PresentationPage actions
 *
 */

import * as types from '../constants';

export function optionRiderSelect(section, riderId, rfpQuoteOptionNetworkId, optionId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_RIDER_SELECT,
    payload: { riderId, rfpQuoteOptionNetworkId, optionId },
  };
}

export function optionRiderUnSelect(section, riderId, rfpQuoteOptionNetworkId, optionId) {
  return {
    meta: {
      section,
    },
    type: types.OPTION_RIDER_UNSELECT,
    payload: { riderId, rfpQuoteOptionNetworkId, optionId },
  };
}

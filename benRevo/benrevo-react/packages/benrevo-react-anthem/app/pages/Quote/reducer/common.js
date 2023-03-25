import { fromJS, Map } from 'immutable';
import {
  CARRIERS_GET_SUCCESS,
  QuoteState,
} from '@benrevo/benrevo-react-quote';

export function carriersGetSuccess(state, action) {
  let data = fromJS([]);
  let mainCarrier = {};
  let kaiserCarrier = QuoteState.get(action.meta.section).get('kaiserCarrier');
  let clearValueCarrier = QuoteState.get(action.meta.section).get('clearValueCarrier');

  action.payload.map((item) => {
    if (item.carrier.name === 'ANTHEM_BLUE_CROSS') {
      mainCarrier = Map(item);
    } else if (item.carrier.name === 'ANTHEM_CLEAR_VALUE') {
      clearValueCarrier = Map(item);
    } else {
      if (item.carrier.name === 'KAISER') {
        kaiserCarrier = Map(item);
      }

      data = data.push(item);
    }

    return true;
  });

  return state
    .setIn([action.meta.section, 'mainCarrier'], mainCarrier)
    .setIn([action.meta.section, 'clearValueCarrier'], clearValueCarrier)
    .setIn([action.meta.section, 'kaiserCarrier'], kaiserCarrier)
    .setIn([action.meta.section, 'carrierList'], data);
}


export function reducer(state = [], action) {
  switch (action.type) {
    case CARRIERS_GET_SUCCESS: return carriersGetSuccess(state, action);
    default: return state;
  }
}

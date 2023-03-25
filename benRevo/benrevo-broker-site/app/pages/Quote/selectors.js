/**
 * The client state selectors
 */

import { createSelector } from 'reselect';

const selectCurrentClient = () => (state) => state.get('clients').get('current');
const presentationBroker = (state) => state.get('presentation');
const selectApp = (state) => state.get('app');

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }

    return substate.toJS();
  }
);

const selectOtherCarrier = createSelector(
  selectApp,
  (substate) => {
    const carrierList = substate.get('rfpcarriers').get('medical').toJS();
    let otherCarrier = null;

    for (let j = 0; j < carrierList.length; j += 1) {
      const listItem = carrierList[j].carrier;
      if (listItem.name === 'OTHER') {
        otherCarrier = listItem;
        break;
      }
    }
    return otherCarrier;
  }
);

export {
  presentationBroker,
  selectClient,
  selectOtherCarrier,
};

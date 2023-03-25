/**
 * The client state selectors
 */

import { createSelector } from 'reselect';

const selectCurrentClient = () => (state) => state.get('clients').get('current');
const presentationBroker = (state) => state.get('presentation');

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }

    return substate.toJS();
  }
);

const selectPlanTypes = (section) => createSelector(
  presentationBroker,
  (substate) => {
    const types = substate.get(section).get('types');
    if (!types) {
      throw new Error('No types found');
    }
    return types.toJS();
  }
);

const selectOpenedOption = (section) => createSelector(
  presentationBroker,
  (substate) => substate.get(section).get('openedOption').toJS(),
);

const selectProduct = () => createSelector(
  presentationBroker,
  (substate) => substate.get('comparePlans').get('sectionSelected').toJS(),
);

export {
  selectOpenedOption,
  presentationBroker,
  selectClient,
  selectPlanTypes,
  selectProduct,
};

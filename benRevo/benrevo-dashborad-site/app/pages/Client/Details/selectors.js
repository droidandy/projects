/**
 * The clients state selectors
 */

import { createSelector } from 'reselect';

const selectDetails = (state) => state.get('clientDetails');
const selectApp = (state) => state.get('app');

const sortActivities = createSelector(
  selectDetails,
  (substate) => {
    const activities = substate.get('activities').toJS();
    const sort = substate.get('sort');
    const prop = sort.get('prop');

    activities.sort(
      (a, b) => {
        const x = (sort.get('order') === 'ascending') ? a[prop] : b[prop];
        const y = (sort.get('order') === 'ascending') ? b[prop] : a[prop];
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        }
        return 0;
      }
    );

    return activities;
  }
);

const makeCarriers = createSelector(
  selectApp,
  (substate) => {
    const carriers = substate.get('carriers').toJS();
    const data = {
      medical: [],
      dental: [],
      vision: [],
      life: [],
      std: [],
      ltd: [],
    };

    for (let k = 0; k < Object.keys(carriers).length; k += 1) {
      const product = Object.keys(carriers)[k];

      for (let i = 0; i < carriers[product].length; i += 1) {
        const carrier = carriers[product][i];

        data[product].push({
          text: carrier.displayName,
          value: carrier.carrierId,
        });
      }
    }

    return data;
  }
);

const selectActivity = createSelector(
  selectDetails,
  (substate) => substate.get('currentActivity').toJS()
);

const selectClient = createSelector(
  selectDetails,
  (substate) => substate.get('current').toJS()
);

const selectProduct = createSelector(
  selectDetails,
  (substate) => substate.get('optionsProduct')
);

const selectHistoryEdits = createSelector(
  selectDetails,
  (substate) => substate.get('historyEdits')
);

export {
  selectDetails,
  selectClient,
  selectProduct,
  selectActivity,
  sortActivities,
  makeCarriers,
  selectHistoryEdits,
};

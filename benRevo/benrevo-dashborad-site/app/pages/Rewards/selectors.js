/**
 * The rewards state selectors
 */

import _ from 'lodash';
import { createSelector } from 'reselect';

const selectRewards = (state) => state.get('rewards');

const selectFilters = createSelector(
  selectRewards,
  (substate) => substate.get('filters').toJS(),
);

const sortData = createSelector(
  selectRewards,
  (substate) => {
    const rewards = substate.get('rewards').toJS();
    const sort = substate.get('sort');
    const prop = sort.get('prop');

    const sorting = (items, column) => _.sortBy(items, [column]);
    const data = (sort.get('order') === 'ascending') ? sorting(rewards, prop) : sorting(rewards, prop).reverse();
    const optimizeData = [];

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      let found = false;

      for (let j = 0; j < optimizeData.length; j += 1) {
        const optimizeItem = optimizeData[j];

        if (item.recipientName === optimizeItem.recipientName) {
          found = true;
          optimizeItem.clients.push({ clientName: item.clientName, requestDate: item.requestDate, pointsTotal: item.pointsTotal });
          break;
        }
      }

      if (!found) {
        const newItem = { ...item, clients: [{ clientName: item.clientName, requestDate: item.requestDate, pointsTotal: item.pointsTotal }] };
        delete newItem.clientName;
        delete newItem.requestDate;
        delete newItem.pointsTotal;

        optimizeData.push(newItem);
      }
    }

    return optimizeData;
  }
);

export {
  selectFilters,
  selectRewards,
  sortData,
};

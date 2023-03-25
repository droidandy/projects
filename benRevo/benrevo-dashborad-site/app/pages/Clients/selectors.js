/**
 * The clients state selectors
 */

import _ from 'lodash';
import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('app');
const selectClients = (state) => state.get('clientsList');

const selectFilters = createSelector(
  selectClients,
  (substate) => substate.get('filters').toJS(),
);

const sortClients = createSelector(
  selectClients,
  (substate) => {
    const clients = substate.get('clients').toJS();
    const sort = substate.get('sort');
    const prop = sort.get('prop');

    const sorting = (items, column) => {
      if (column !== 'quotedProducts') {
        return _.sortBy(items, [column]);
      }
      return items.sort((a, b) => {
        if (a.quotedProducts && b.quotedProducts) {
          if (a.quotedProducts.length > b.quotedProducts.length) {
            return 1;
          }
          if (a.quotedProducts.length < b.quotedProducts.length) {
            return -1;
          }
        }

        return 0;
      });
    };

    return (sort.get('order') === 'ascending') ? sorting(clients, prop) : sorting(clients, prop).reverse();
  }
);

const getClientById = (client, list) => {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].clientId === client.clientId) {
      return i;
    }
  }
  return -1;
};

export {
  selectGlobal,
  selectClients,
  sortClients,
  selectFilters,
  getClientById,
};

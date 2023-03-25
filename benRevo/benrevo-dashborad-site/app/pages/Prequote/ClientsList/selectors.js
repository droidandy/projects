/**
 * The preQuoted state selectors
 */

import _ from 'lodash';
import { createSelector } from 'reselect';

const preQuotedState = (state) => state.get('preQuoted');
const selectNewRfps = (state) => preQuotedState(state).get('NewRfps');
const selecInProgress = (state) => preQuotedState(state).get('InProgress');
const selectSort = (state) => preQuotedState(state).get('sort');

const selectorCreator = (clients, sort) => {
  const prop = sort.get('prop');

  if (clients) {
    const sorting = (items, column) => _.sortBy(items.toJS(), [column]);
    return (sort.get('order') === 'ascending') ? sorting(clients, prop) : sorting(clients, prop).reverse();
  }

  return {};
};

const selectSortedNewRfps = createSelector(
  [selectNewRfps, selectSort],
  selectorCreator
);

const selectSortedInProgress = createSelector(
  [selecInProgress, selectSort],
  selectorCreator
);

export {
  selectSortedNewRfps,
  selectSortedInProgress,
};

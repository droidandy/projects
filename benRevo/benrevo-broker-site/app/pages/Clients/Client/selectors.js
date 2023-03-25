/**
 * The client state selectors
 */

import { createSelector } from 'reselect';

const clientPage = (state) => state.get('client');

const makeSelectSelectedCattiers = () => createSelector(
  clientPage,
  (clientState) => clientState.get('selectedCarriers').toJS()
);

export { makeSelectSelectedCattiers };

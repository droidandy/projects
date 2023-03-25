/**
 * The client state selectors
 */

import { createSelector } from 'reselect';

const adminBroker = (state) => state.get('adminBroker');

const makeSelectCarrierEmailList = () => createSelector(
  adminBroker,
  (adminBrokerState) => adminBrokerState.get('carrierEmailList').toJS()
);

export {
  adminBroker,
  makeSelectCarrierEmailList,
};

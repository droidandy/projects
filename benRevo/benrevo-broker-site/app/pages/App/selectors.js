/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('app');
const selectRfpCarriers = (state, section) => state.get('app').get('rfpcarriers').get(section);
const selectRfpCarriersAll = (state) => state.get('app').get('rfpcarriers');

const makeSelectCurrentUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('currentUser')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectRepos = () => createSelector(
  selectGlobal,
  (globalState) => globalState.getIn(['userData', 'repositories'])
);

const makeSelectRfpcarriers = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('rfpcarriers').toJS()
);

const makeSelectRfpcarriersProduct = (section) => createSelector(
  selectRfpCarriersAll,
  (substate) => substate.get(section).toJS()
);

const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

const selectPlansCarrierList = createSelector(
  selectRfpCarriers,
  (substate) => {
    const carrierList = substate.toJS();
    const finalCarriers = [];

    for (let j = 0; j < carrierList.length; j += 1) {
      const listItem = carrierList[j].carrier;
      finalCarriers.push({
        key: listItem.carrierId,
        value: listItem.carrierId,
        text: listItem.displayName,
      });
    }
    return finalCarriers;
  }
);

const selectCarrierById = (carrierId, section) => createSelector(
  selectRfpCarriersAll,
  (substate) => {
    const carrierList = substate.get(section).toJS();
    for (let j = 0; j < carrierList.length; j += 1) {
      const listItem = carrierList[j].carrier;

      if (listItem.carrierId === carrierId) return listItem;
    }

    return {};
  }
);

const selectCarrierByName = (name, section) => createSelector(
  selectRfpCarriersAll,
  (substate) => {
    const carrierList = substate.get(section).toJS();
    for (let j = 0; j < carrierList.length; j += 1) {
      const listItem = carrierList[j].carrier;

      if (listItem.displayName === name) return listItem;
    }

    return {};
  }
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocationState,
  makeSelectRfpcarriers,
  makeSelectRfpcarriersProduct,
  selectPlansCarrierList,
  selectCarrierById,
  selectCarrierByName,
};

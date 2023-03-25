/**
 * The global state selectors
 */

import { createSelector } from 'reselect';
import * as types from './constants';

const selectGlobal = (state) => state.get('app');
const selectAppCarriers = (state, section) => state.get('app').get('carriers').get(section);

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

const makeProducts = createSelector(
  () => [
    {
      text: 'Medical',
      value: types.MEDICAL_SECTION.toUpperCase(),
    },
    {
      text: 'Dental',
      value: types.DENTAL_SECTION.toUpperCase(),
    },
    {
      text: 'Vision',
      value: types.VISION_SECTION.toUpperCase(),
    },
  ]
);

const makeBrokers = createSelector(
  selectGlobal,
  (substate) => {
    const brokers = substate.get('brokers').toJS();
    const data = [];
    const temp = {};
    for (let i = 0; i < brokers.length; i += 1) {
      const item = brokers[i];
      if (item.name && !temp[item.name]) {
        data.push({
          text: item.name,
          value: item.name,
        });
        temp[item.name] = true;
      }
    }

    return data;
  }
);

const makeSelectRfpcarriersProduct = createSelector(
  selectAppCarriers,
  (substate) => substate.toJS()
);

const makeSelectRfpCarriers = createSelector(
  selectGlobal,
  (substate) => substate.get('carriers').toJS()
);

const makeSelectMainCarrier = createSelector(
  selectGlobal,
  (substate) => substate.get('mainCarrier').toJS()
);

export {
  selectGlobal,
  makeSelectCurrentUser,
  makeSelectLoading,
  makeSelectError,
  makeSelectRepos,
  makeSelectLocationState,
  makeSelectRfpcarriersProduct,
  makeProducts,
  makeBrokers,
  makeSelectMainCarrier,
  makeSelectRfpCarriers,
};

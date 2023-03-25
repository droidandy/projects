import { createSelector } from 'reselect';
import * as types from './constants';

/**
 * Direct selector to the clientPage state domain
 */
const selectClientPageDomain = (state) => state.get('clients');
const selectProfilePageDomain = (state) => state.get('profile');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ClientPage
 */

const makeSelectClientPage = () => createSelector(
  selectClientPageDomain,
  (substate) => substate.toJS()
);

const selectCurrentClient = () => createSelector(
  selectClientPageDomain,
  (substate) => substate.get('current').toJS()
);

const selectClientToResponse = () => createSelector(
  selectClientPageDomain,
  (substate) => {
    const client = substate.get('current').toJS();
    const state = client.clientState;
    client.rfpProducts = [];

    if (state === types.RFP_SUBMITTED_NORMAL) client.clientState = types.RFP_SUBMITTED;
    else if (state === types.RFP_STARTED_NORMAL) client.clientState = types.RFP_STARTED;
    else if (state === types.QUOTED_NORMAL) client.clientState = types.QUOTED;
    else if (state === types.SUBMITTED_FOR_APPROVAL_NORMAL) client.clientState = types.SUBMITTED_FOR_APPROVAL;
    else if (state === types.ON_BOARDING_NORMAL) client.clientState = types.ON_BOARDING;
    else if (state === types.PENDING_APPROVAL_NORMAL) client.clientState = types.PENDING_APPROVAL;
    else if (state === types.POLICY_FINALIZED_NORMAL) client.clientState = types.POLICY_FINALIZED;
    else if (state === types.COMPLETED_NORMAL) client.clientState = types.COMPLETED;
    else if (state === types.CLOSED_NORMAL) client.clientState = types.CLOSED;
    else if (state === types.WON_NORMAL) client.clientState = types.WON;

    for (let i = 0; i < Object.keys(client.products).length; i += 1) {
      const key = Object.keys(client.products)[i];

      if (client.products[key]) {
        client.rfpProducts.push({
          displayName: null,
          name: key.toUpperCase(),
          extProductId: null,
          virginGroup: client.virginCoverage[key],
        });
      }
    }

    for (let i = 0; i < Object.keys(client).length; i += 1) {
      const key = Object.keys(client)[i];

      if (client[key] === '') client[key] = null;
    }

    delete client.products;
    delete client.virginCoverage;
    delete client.attributes;

    return client;
  }
);

const selectDirectToPresentation = createSelector(
  selectCurrentClient(),
  (substate) => checkDirectToPresentation(substate)
);

const checkDirectToPresentation = (client) => {
  let directToPresentation = false;

  for (let i = 0; i < client.attributes.length; i += 1) {
    if (client.attributes[i] === types.DIRECT_TO_PRESENTATION) {
      directToPresentation = true;
      break;
    }
  }

  return directToPresentation;
};

const selectTimelineIsEnabled = createSelector(
  selectCurrentClient(),
  (substate) => checkTimelineIsEnabled(substate)
);

const checkTimelineIsEnabled = (client) => {
  let timelineIsEnabled = false;

  for (let i = 0; i < client.attributes.length; i += 1) {
    if (client.attributes[i] === types.TIMELINE_IS_ENABLED) {
      timelineIsEnabled = true;
      break;
    }
  }

  return timelineIsEnabled;
};

const selectBrokerageList = createSelector(
  selectProfilePageDomain,
  (substate) => {
    const brokerages = substate.get('brokerages').toJS();
    brokerages.sort(
      (a, b) => {
        const x = (a.name ? a.name.toLowerCase() : a.name);
        const y = (b.name ? b.name.toLowerCase() : b.name);
        if (x < y) {
          return -1;
        } else if (x > y) {
          return 1;
        }
        return 0;
      }
    );

    const final = [];

    for (let i = 0; i < brokerages.length; i += 1) {
      const listItem = brokerages[i];
      final.push({
        key: listItem.id,
        value: listItem.id,
        text: listItem.name,
      });
    }
    return final;
  }
);

const selectUserRole = createSelector(
  selectProfilePageDomain,
  (substate) => substate.get('brokerageRole'),
);

const selectBrokerageFromProfile = createSelector(
  selectProfilePageDomain,
  (profile) => profile.get(types.BROKERAGE),
);

export {
  selectCurrentClient,
  makeSelectClientPage,
  selectClientPageDomain,
  selectClientToResponse,
  selectDirectToPresentation,
  selectTimelineIsEnabled,
  checkDirectToPresentation,
  checkTimelineIsEnabled,
  selectBrokerageList,
  selectUserRole,
  selectBrokerageFromProfile,
};

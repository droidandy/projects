import { createSelector } from 'reselect';
import { DOCUMENT_NORTH, DOCUMENT_SOUTH } from './constants';

const selectCurrentClient = () => (state) => state.get('clients').get('current');

const selectClient = () => createSelector(
  selectCurrentClient(),
  (substate) => {
    if (!substate.get('id')) {
      throw new Error('No Client Id found');
    }

    return substate.toJS();
  }
);

const selectPresentation = (state) => state.get('presentation');

const selectCurrentOption = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('current').toJS()
);

const selectCarrier = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('mainCarrier').toJS()
);

const selectCarrierList = () => createSelector(
  selectPresentation,
  (substate) => {
    const data = {
      medical: substate.get('medical').get('carrierList').toJS(),
      dental: substate.get('dental').get('carrierList').toJS(),
      vision: substate.get('vision').get('carrierList').toJS(),
    };

    return data;
  }
);

const selectSelectedOption = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('selected')
);

const selectQuotes = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('quotes').toJS()
);

const selectClearValueCarrier = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('clearValueCarrier').toJS()
);

function mappingContributionsByNetwork(state, section, index) {
  const network = state
    .get(section)
    .get('openedOptionContributions')
    .get(index);
  const contributions = network
    .get('contributions').toJS();

  const data = {
    erContributionFormat: network.get('proposedContrFormat'),
    rfpQuoteOptionNetworkId: network.get('rfpQuoteOptionNetworkId'),
  };

  contributions.map((item, i) => {
    data[`tier${i + 1}ErContribution`] = parseFloat(item.proposedER || 0);
    data[`tier${i + 1}Enrollment`] = parseFloat(item.proposedEnrollment || 0);
    data[`tier${i + 1}EeFund`] = parseFloat(item.fundEE || 0);
    return true;
  });

  return data;
}

const selectContributions = (section, index) => createSelector(
  selectPresentation,
  (substate) => [mappingContributionsByNetwork(substate, section, index)],
);

function mappingEnrollment(state, section) {
  const contributions = state
    .get(section)
    .get('enrollment')
    .get('contributions').toJS();
  const networks = state
    .get(section)
    .get('enrollment')
    .get('networks').toJS();

  const data = [];

  networks.map((network, i) => {
    const contributionItem = {
      clientPlanId: network.clientPlanId,
    };
    contributions.map((item, j) => {
      contributionItem[`tier${j + 1}Enrollment`] = parseFloat(item.values[i].value || 0);
      return true;
    });

    data.push(contributionItem);

    return true;
  });

  return data;
}
const selectCarrierByName = (section, name) => createSelector(
  selectPresentation,
  (substate) => {
    const carrierList = substate.get(section).get('carrierList');
    const mainCarrier = substate.get(section).get('mainCarrier');
    const clearValueCarrier = substate.get(section).get('clearValueCarrier');
    let carrier;

    if (mainCarrier.get('carrier').displayName === name) {
      return mainCarrier.toJS();
    }

    if (clearValueCarrier.get('carrier').displayName === name) {
      return clearValueCarrier.toJS();
    }

    carrierList.map((item) => {
      if (item.carrier.displayName === name) {
        carrier = item;

        return true;
      }

      return true;
    });

    return carrier;
  },
);

const selectDocuments = createSelector(
  selectPresentation,
  (substate) => {
    const data = substate.get('documents').get('data').toJS();
    const documents = {
      all: [],
      north: [],
      south: [],
    };

    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      let found = false;

      for (let j = 0; j < item.tags.length; j += 1) {
        const tag = item.tags[j];
        if (tag === DOCUMENT_SOUTH) {
          documents.south.push(item);
          found = true;
          break;
        } else if (tag === DOCUMENT_NORTH) {
          documents.north.push(item);
          found = true;
          break;
        }
      }

      if (!found) documents.all.push(item);
    }

    return documents;
  },
);

const selectEnrollment = (section) => createSelector(
  selectPresentation,
  (substate) => mappingEnrollment(substate, section),
);

const selectCompare = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('checkedOptions').toJS(),
);

const selectOpenedOption = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('openedOption').toJS(),
);

const selectFilter = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('filter').toJS(),
);

const selectPage = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('page').toJS(),
);

const selectMatch = () => createSelector(
  selectPresentation,
  (substate) => substate.get('isMatch'),
);

const selectNewPlan = (section) => createSelector(
  selectPresentation,
  (substate) => substate.get(section).get('newPlan').toJS(),
);

export {
  selectPresentation,
  selectCarrierByName,
  selectCurrentClient,
  selectCurrentOption,
  selectClient,
  selectCompare,
  selectCarrier,
  selectCarrierList,
  selectClearValueCarrier,
  selectContributions,
  selectEnrollment,
  selectOpenedOption,
  selectPage,
  selectQuotes,
  selectSelectedOption,
  selectDocuments,
  selectFilter,
  selectMatch,
  selectNewPlan,
};

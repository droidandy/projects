import { createSelector } from 'reselect';
// import util from 'util';

/**
 * Direct selector to the presentationPage state domain
 */
const selectPresentationPageDomain = () => (state) => state.get('presentation').get('medical');

/**
 * Other specific selectors
 */
const makeSelectTotalAnnualPremium = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('totalAnnualPremium')
);

const makeSelectPlanType = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('planType')
);

const makeSelectIsStatic = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('isStatic')
);

const makeSelectAddablePlans = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('addablePlans').toArray()
);

const makeSelectPercentDifference = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('percentDifference')
);

const makeSelectDollarDifference = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('dollarDifference')
);

const makeSelectOverviewPlans = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('overviewPlans').toArray()
);

const makeSelectDetailedPlans = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('detailedPlans').toArray()
);

const makeSelectLoading = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.get('loading')
);

/**
 * Default selector used by PresentationPage
 */
const makeSelectPresentationPage = () => createSelector(
  selectPresentationPageDomain(),
  (substate) => substate.toJS()
);

export {
  selectPresentationPageDomain,
  makeSelectTotalAnnualPremium,
  makeSelectPlanType,
  makeSelectIsStatic,
  makeSelectAddablePlans,
  makeSelectPresentationPage,
  makeSelectLoading,
  makeSelectPercentDifference,
  makeSelectDollarDifference,
  makeSelectOverviewPlans,
  makeSelectDetailedPlans,
};

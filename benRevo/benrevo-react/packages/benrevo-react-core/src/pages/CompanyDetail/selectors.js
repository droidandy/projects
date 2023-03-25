import { createSelector } from 'reselect';

/**
 * Direct selector to the companyDetailPage state domain
 */
const selectCompanyDetailPageDomain = (state) => state.get('companyDetailPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by CompanyDetailPage
 */

const makeSelectCompanyDetailPage = () => createSelector(
  selectCompanyDetailPageDomain,
  (substate) => substate.toJS()
);

export {
  makeSelectCompanyDetailPage,
  selectCompanyDetailPageDomain,
};

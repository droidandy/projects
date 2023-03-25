/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectHome = (state) => state.get('home');

const makeSelectForm = () => createSelector(
  selectHome,
  (homeState) => homeState.get('form').toJS()
);

export {
  selectHome,
  makeSelectForm,
};

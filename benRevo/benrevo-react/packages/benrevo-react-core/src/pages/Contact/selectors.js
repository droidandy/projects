import { createSelector } from 'reselect';

const selectContact = (state) => state.get('contactPage');

const makeSelectForm = () => createSelector(
  selectContact,
  (homeState) => homeState.get('form').toJS()
);

export {
  selectContact,
  makeSelectForm,
};

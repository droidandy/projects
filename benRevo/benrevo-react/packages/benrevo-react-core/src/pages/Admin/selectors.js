import { createSelector } from 'reselect';

const selectDisclosure = (state) => state.get('adminPage');

const makeSelectDisclosure = () => createSelector(
  selectDisclosure,
  (homeState) => homeState.get('disclosure').get('data')
);

export {
  selectDisclosure,
  makeSelectDisclosure,
};

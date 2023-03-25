import { createSelector } from 'reselect';

const brokerageState = (state) => state.get('brokerage');

const selectChanges = createSelector(
  brokerageState,
  (substate) => substate.get('changedBrokerage').toJS()
);

export {
  selectChanges,
};

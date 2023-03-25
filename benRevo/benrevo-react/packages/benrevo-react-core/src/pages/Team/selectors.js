import { createSelector } from 'reselect';

const selectClientRequest = () => createSelector(
  selectRfpClient(), (substate) => substate.toJS()
);

const selectRfpClient = () => (state) => state.get('clients').get('current');

export {
  selectClientRequest,
};

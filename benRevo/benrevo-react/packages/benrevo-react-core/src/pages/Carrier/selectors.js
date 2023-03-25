import { createSelector } from 'reselect';

const selectProfile = () => (state) => state.get('profile');


const selectProfileMeta = () => createSelector(
  selectProfile(),
  (substate) => {
    const profile = substate.toJS();
    return {
      brokerageRole: ['client'],
      brokerage: profile.brokerage,
      brokerageId: profile.brokerage,
    };
  }
);

export {
  selectProfileMeta,
};

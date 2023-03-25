import { createSelector } from 'reselect';

const selectPlanDesign = (state) => state.get('planDesign');

const selectYear = createSelector(
  selectPlanDesign,
  (substate) => substate.get('inputYear')
);

function getBenefitNames(plans) {
  const results = [];
  for (let i = 0; i < plans.length; i += 1) {
    for (let j = 0; j < plans[i].planBenefits.length; j += 1) {
      if (results.indexOf(plans[i].planBenefits[j].name) === -1) {
        results.push(plans[i].planBenefits[j].name);
      }
    }
  }
  return results;
}

export {
  selectYear,
  getBenefitNames,
};

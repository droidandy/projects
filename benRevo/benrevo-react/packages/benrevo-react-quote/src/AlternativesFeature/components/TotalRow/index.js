import { connect } from 'react-redux';
import TotalRow from './TotalRow';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const alternativesPlans = overviewState.get('alternativesPlans').toJS();
  let currentPlan = {};
  let selectedPlan = {};
  let currentPlanIndex = 0;
  let selectedRxPlan = {};
  let selectedPlanIndex = 0;
  let selectedRxPlanIndex = {};
  if (alternativesPlans.plans && alternativesPlans.plans.length) {
    for (let index = 0; index < alternativesPlans.plans.length; index += 1) {
      const plan = alternativesPlans.plans[index];
      if (plan.type === 'current' && !plan.selected) {
        currentPlan = plan;
        currentPlanIndex = index;
      }
      if (plan.selected) {
        selectedPlan = plan;
        selectedPlanIndex = index;
      }
    }
  }
  if (alternativesPlans.rx && alternativesPlans.rx.length) {
    for (let ind = 0; ind < alternativesPlans.rx.length; ind += 1) {
      const pln = alternativesPlans.rx[ind];
      if (pln && pln.selected) {
        selectedRxPlan = pln;
        selectedRxPlanIndex = ind;
      }
    }
  }
  return {
    loadingAfterSelect: overviewState.get('loadingAfterSelect'),
    currentPlan,
    alternativesPlans,
    selectedPlan,
    currentPlanIndex,
    selectedRxPlan,
    selectedPlanIndex,
    selectedRxPlanIndex,
  };
}


function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(TotalRow);

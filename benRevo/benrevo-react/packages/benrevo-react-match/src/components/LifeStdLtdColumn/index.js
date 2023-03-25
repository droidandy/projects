import { connect } from 'react-redux';
import { selectPlanLife } from '@benrevo/benrevo-react-quote';
import { Map } from 'immutable';
import LifeStdLtdColumn from './LifeStdLtdColumn';


function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  let selectedPlan = {};
  if (detailedPlan && detailedPlan.plans && detailedPlan.plans.length) {
    detailedPlan.plans.forEach((plan) => {
      if (plan.selected) {
        selectedPlan = plan;
      }
    });
  }
  if (!selectedPlan || !Object.keys(selectedPlan).length) {
    selectedPlan = overviewState.get('selectedPlan').toJS() || Map({});
  }
  return {
    selectedPlan,
    detailedPlan,
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
    planTemplate: overviewState.get('planTemplate').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectPlanLife: (section, plan, networkId, index) => { dispatch(selectPlanLife(section, plan, networkId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LifeStdLtdColumn);

import { connect } from 'react-redux';
import PlanNameDropdown from './PlanNameDropdown';
import { selectPlanBroker } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  return {
    selectedPlan: overviewState.get('selectedPlan').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    section,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectPlan: (section, planId, networkId, index) => { dispatch(selectPlanBroker(section, planId, networkId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanNameDropdown);


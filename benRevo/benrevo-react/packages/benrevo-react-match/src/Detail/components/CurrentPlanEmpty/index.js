import { connect } from 'react-redux';
import CurrentPlanEmpty from './CurrentPlanEmpty';

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const currentPlan = (detailedPlan && detailedPlan.currentPlan) ? detailedPlan.currentPlan : {};
  return {
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    accordionActiveIndex: state.get('presentation').get('accordionActiveIndex').toJS(),
    currentPlan,
  };
}

export default connect(mapStateToProps)(CurrentPlanEmpty);

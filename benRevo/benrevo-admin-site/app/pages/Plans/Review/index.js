import { connect } from 'react-redux';
import PlanReview from './PlanReview';

function mapStateToProps(state) {
  const baseState = state.get('base');
  const plansState = state.get('plans');
  return {
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    medicalPlans: plansState.get('medical').get('plans').toJS(),
    dentalPlans: plansState.get('dental').get('plans').toJS(),
    visionPlans: plansState.get('vision').get('plans').toJS(),
    summaries: plansState.get('summaries').toJS(),
  };
}

function mapDispatchToProps() {
  return {
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanReview);

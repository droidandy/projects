import { connect } from 'react-redux';
import PlanQuoteReview from './PlanQuoteReview';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[2].path;
  const baseState = state.get('base');
  const plansState = state.get('plans');
  return {
    section,
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
    quotePreview: plansState.get(section).get('quotePreview').toJS(),
  };
}

function mapDispatchToProps() {
  return {
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanQuoteReview);

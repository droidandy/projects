import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PlanDental from './PlanDental';
import { updatePlanField, createNewPlan } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const baseState = state.get('base');
  return {
    plansTemplates: overviewState.get('dental').toJS().plans,
    planAddedSuccess: overviewState.get('dental').toJS().planAddedSuccess,
    loading: overviewState.toJS().loading,
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewPlan: (section) => { dispatch(createNewPlan(section)); },
    updatePlanField: (section, index1, index2, valType, value) => { dispatch(updatePlanField(section, index1, index2, valType, value)); },
    next: () => { dispatch(push('/client/plans/vision')); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanDental);

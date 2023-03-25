import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PlanMedical from './PlanMedical';
import { createNewPlan, updatePlanField } from '../actions';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const baseState = state.get('base');
  return {
    plansTemplates: overviewState.get('medical').toJS().plans,
    planAddedSuccess: overviewState.get('medical').toJS().planAddedSuccess,
    loading: overviewState.toJS().loading,
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedClient: baseState.get('selectedClient').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewPlan: (section) => { dispatch(createNewPlan(section)); },
    updatePlanField: (section, index1, index2, valType, value, rxFlag) => { dispatch(updatePlanField(section, index1, index2, valType, value, rxFlag)); },
    next: () => { dispatch(push('/client/plans/dental')); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanMedical);

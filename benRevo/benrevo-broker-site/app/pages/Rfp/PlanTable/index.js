import { connect } from 'react-redux';
import PlanTable from './PlanTable';
import { changePlanField } from '../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[3].path;
  const infoState = state.get('rfp').get(section);
  const clientsState = state.get('clients');

  return {
    section,
    client: clientsState.get('current').toJS(),
    benefitsPlans: infoState.get('benefits').toJS(),
    plans: infoState.get('plans').toJS(),
    rfpCarriers: state.get('app').get('rfpcarriers').get(section).toJS(),
    planNetworks: infoState.get('rfpPlanNetworks').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changePlanField: (section, index, key, type, valueKey, value, planType) => { dispatch(changePlanField(section, index, key, type, valueKey, value, planType)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanTable);

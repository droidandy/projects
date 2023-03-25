import { connect } from 'react-redux';
import Plans from './Plans';
import { getClientPlans, getCarrierHistory, updatePlansPage, getSummary, getDates } from './actions';

function mapStateToProps(state) {
  const baseState = state.get('base');
  return {
    selectedClient: baseState.get('selectedClient').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCPlans: (clientId) => { dispatch(getClientPlans(clientId)); },
    getCHistory: (section) => { dispatch(getCarrierHistory(section)); },
    updatePlansPage: () => { dispatch(updatePlansPage()); },
    getSummary: () => { dispatch(getSummary()); },
    getDates: () => { dispatch(getDates()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Plans);

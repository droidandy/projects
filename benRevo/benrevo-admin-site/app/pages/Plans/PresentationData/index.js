import { connect } from 'react-redux';
import PresentationData from './PresentationData';
import { resetPlanChanges, updateSelectedPlan, getClientPlans, saveContribution } from '../actions';
import { selectTiers } from '../selectors';

function mapStateToProps(state) {
  const overviewState = state.get('plans');
  const baseState = state.get('base');

  return {
    loadingContributions: overviewState.get('loadingContributions'),
    selectedClient: baseState.get('selectedClient').toJS(),
    clientPlans: overviewState.get('clientPlans').toJS(),
    changedPlans: overviewState.get('changedPlans').toJS(),
    currentBroker: baseState.get('currentBroker').toJS(),
    selectedTiers: selectTiers()(state),
    savingContributions: overviewState.get('savingContributions'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPlanChanges: (index) => { dispatch(resetPlanChanges(index)); },
    updateSelectedPlan: (index, id, key, value) => { dispatch(updateSelectedPlan(index, id, key, value)); },
    getClientPlans: (clientId) => { dispatch(getClientPlans(clientId)); },
    saveContribution: () => { dispatch(saveContribution()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PresentationData);

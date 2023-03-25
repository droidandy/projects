import { connect } from 'react-redux';
import Alternatives from './Alternatives';
import { getPlans, selectPlan, addPlan, updatePlanField, editPlan, deletePlan, setStateAlternativesPlans, saveCurrentPlan, downloadPlanBenefitsSummary } from '../actions';

function mapStateToProps(state, ownProps) {
  const overviewState = state.get('presentation').get(ownProps.section);
  return {
    loading: overviewState.get('loading'),
    plansGetSuccess: overviewState.get('plansGetSuccess'),
    plansGetError: overviewState.get('plansGetError'),
    alternativesPlans: overviewState.get('alternativesPlans').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    newPlan: overviewState.get('newPlan').toJS(),
    mainCarrier: overviewState.get('mainCarrier').toJS(),
    clearValueCarrier: overviewState.get('clearValueCarrier').toJS(),
    page: overviewState.get('page').toJS(),
    stateAlternativesPlans: overviewState.get('stateAlternativesPlans').toJS(),
  };
}


function mapDispatchToProps(dispatch) {
  return {
    getPlans: (section, networkIndex, multiMode) => {
      dispatch(getPlans(section, networkIndex, multiMode));
    },
    selectPlan: (section, planId, networkId, index, multiMode, carrier) => { dispatch(selectPlan(section, planId, networkId, index, multiMode, carrier)); },
    saveCurrentPlan: (section, plan, index, networkIndex, multiMode, externalRX) => { dispatch(saveCurrentPlan(section, plan, index, networkIndex, multiMode, externalRX)); },
    addPlan: (section, newPlan, networkIndex, multiMode) => { dispatch(addPlan(section, newPlan, networkIndex, multiMode)); },
    editPlan: (section, plan, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(editPlan(section, plan, rfpQuoteNetworkId, networkIndex, multiMode)); },
    deletePlan: (section, rfpQuoteNetworkPlanId, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(deletePlan(section, rfpQuoteNetworkPlanId, rfpQuoteNetworkId, networkIndex, multiMode)); },
    updatePlanField: (section, name, value, part, valName, status, planIndex, externalRx) => { dispatch(updatePlanField(section, name, value, part, valName, status, planIndex, externalRx)); },
    setStateAlternativesPlans: (section, stateAlternativesPlans) => { dispatch(setStateAlternativesPlans(section, stateAlternativesPlans)); },
    downloadPlanBenefitsSummary: (summaryFileLink, planName) => { dispatch(downloadPlanBenefitsSummary(summaryFileLink, planName)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alternatives);

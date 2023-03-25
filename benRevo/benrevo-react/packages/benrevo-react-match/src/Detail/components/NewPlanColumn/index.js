import { connect } from 'react-redux';
import { updatePlanField, addPlan } from '@benrevo/benrevo-react-quote';
import NewPlanColum from './NewPlanColum';
import { editPlanField } from './../../../actions';
import generateEmptyPlanTemplate from './../../../generateEmptyPlanTemplate';

function mapStateToProps(state, ownProps) {
  const { status, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(ownProps.section);
  let planToEdit = {};
  if (status === 'editSelected') {
    planToEdit = detailedPlan.newPlan || overviewState.get('selectedPlan').toJS() || {};
  } else {
    planToEdit = detailedPlan.secondNewPlan || overviewState.get('altPlan').toJS() || {};
  }
  let currentPlan = detailedPlan.currentPlan || {};
  const planTypeTemplates = overviewState.get('planTypeTemplates').toJS();
  if (!currentPlan.cost || !currentPlan.cost.length || !currentPlan.benefits || !currentPlan.benefits.length) {
    const detailedPlanType = detailedPlan ? detailedPlan.type : 'HMO';
    const optionCarrier = overviewState.get('page').get('carrier').toJS();
    let optionCarrierName = 'N/A';
    if (optionCarrier && optionCarrier.carrier && optionCarrier.carrier.name) {
      optionCarrierName = optionCarrier.carrier.name;
    }
    currentPlan = generateEmptyPlanTemplate(planTypeTemplates, detailedPlanType, optionCarrierName);
    if (detailedPlan && detailedPlan.currentPlan && detailedPlan.currentPlan.cost && detailedPlan.currentPlan.cost.length > 0) {
      currentPlan.cost = detailedPlan.currentPlan.cost;
    }
  }
  return {
    newPlan: overviewState.get('newPlan').toJS(),
    planToEdit,
    planTemplate: overviewState.get('planTemplate').toJS(),
    page: overviewState.get('page').toJS(),
    currentPlan,
    detailedPlan,
    benefitsLoading: state.get('presentation').get('benefitsLoading'),
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
    planTypeTemplates,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePlanField: (section, name, value, part, valName, status, planIndex, externalRx) => { dispatch(updatePlanField(section, name, value, part, valName, status, planIndex, externalRx)); },
    addPlan: (section, newPlan, networkIndex, multiMode, status, rfpQuoteOptionNetworkId) => { dispatch(addPlan(section, newPlan, networkIndex, multiMode, status, rfpQuoteOptionNetworkId)); },
    editPlanField: (section, name, value, part, valName, typeOfPlan) => { dispatch(editPlanField(section, name, value, part, valName, typeOfPlan)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(NewPlanColum);

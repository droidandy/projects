import { connect } from 'react-redux';
import { downloadPlanBenefitsSummary, selectPlan } from '@benrevo/benrevo-react-quote';
import RxColumn from './RxColumn';
import { addAlternativePlan, changeFavourite, clearAltPlan } from '../../actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  return {
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
    planTemplate: overviewState.get('planTemplate').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadPlanBenefitsSummary: (summaryFileLink, planName) => { dispatch(downloadPlanBenefitsSummary(summaryFileLink, planName)); },
    selectPlan: (section, planId, networkId, index, multiMode, carrier) => { dispatch(selectPlan(section, planId, networkId, index, multiMode, carrier)); },
    addAlternativePlan: (section, plan) => { dispatch(addAlternativePlan(section, plan)); },
    clearAltPlan: (section) => { dispatch(clearAltPlan(section)); },
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RxColumn);

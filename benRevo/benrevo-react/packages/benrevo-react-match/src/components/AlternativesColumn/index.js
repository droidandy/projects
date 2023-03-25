import { connect } from 'react-redux';
import { downloadPlanBenefitsSummary, selectPlan } from '@benrevo/benrevo-react-quote';
import AlternativesColumn from './AlternativesColumn';
import { selectSecondPlan, changeFavourite } from '../../actions';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  return {
    quoteType: overviewState.get('openedOption').toJS().quoteType || '',
    planTemplate: overviewState.get('planTemplate').toJS(),
    unchangedFirstSelectedPlan: overviewState.get('unchangedFirstSelectedPlan') ? overviewState.get('unchangedFirstSelectedPlan').toJS() : {},
    unchangedFirstSelectedRxPlan: overviewState.get('unchangedFirstSelectedRxPlan') ? overviewState.get('unchangedFirstSelectedRxPlan').toJS() : {},
    unchangedSecondSelectedPlan: overviewState.get('unchangedSecondSelectedPlan') ? overviewState.get('unchangedSecondSelectedPlan').toJS() : {},
    unchangedSecondSelectedRxPlan: overviewState.get('unchangedSecondSelectedRxPlan') ? overviewState.get('unchangedSecondSelectedRxPlan').toJS() : {},
  };
}

function mapDispatchToProps(dispatch) {
  return {
    downloadPlanBenefitsSummary: (summaryFileLink, planName) => { dispatch(downloadPlanBenefitsSummary(summaryFileLink, planName)); },
    selectPlan: (section, planId, networkId, index, multiMode, carrier) => { dispatch(selectPlan(section, planId, networkId, index, multiMode, carrier)); },
    addAlternativePlan: (section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index) => { dispatch(selectSecondPlan(section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index)); },
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AlternativesColumn);

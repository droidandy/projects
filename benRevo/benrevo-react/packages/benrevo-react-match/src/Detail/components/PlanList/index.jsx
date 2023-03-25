import { connect } from 'react-redux';
import { selectPlan, getMode } from '@benrevo/benrevo-react-quote';
import PlanList from './PlanList';
import { changeFavourite, selectSecondPlan, searchText, changeSelectedRx, changeSelectedPlan } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const { rfpQuoteOptionNetworkId } = detailedPlan;
  const overviewState = state.get('presentation').get(section);
  const allPlans = overviewState.get('allPlans');
  return {
    alternativesLoading: overviewState.get('alternativesLoading'),
    currentPlan: detailedPlan.currentPlan,
    allPlans: allPlans.toJS(),
    rfpQuoteOptionNetworkId,
    openedOption: overviewState.get('openedOption').toJS(),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    matchSelectedPlan: overviewState.get('matchSelectedPlan').toJS(),
    matchSelectedRxPlan: overviewState.get('matchSelectedRxPlan').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchText: (section, searchString) => { dispatch(searchText(section, searchString)); },
    selectPlan: (section, planId, networkId, index, multiMode, carrier) => { dispatch(selectPlan(section, planId, networkId, index, multiMode, carrier)); },
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
    addAlternativePlan: (section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index) => { dispatch(selectSecondPlan(section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index)); },
    changeSelectedRx: (section, plan) => { dispatch(changeSelectedRx(section, plan)); },
    changeSelectedPlan: (section, plan) => { dispatch(changeSelectedPlan(section, plan)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanList);

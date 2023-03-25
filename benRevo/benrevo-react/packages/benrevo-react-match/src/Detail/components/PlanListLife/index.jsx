import { connect } from 'react-redux';
import { selectPlanLife, getMode } from '@benrevo/benrevo-react-quote';
import PlanList from './PlanListLife';
import { changeFavourite, selectSecondPlan, searchText } from './../../../actions';

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const allPlans = overviewState.get('allPlans');
  return {
    alternativesLoading: overviewState.get('alternativesLoading'),
    currentPlan: detailedPlan.currentPlan,
    allPlans: allPlans.toJS(),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchText: (section, searchString) => { dispatch(searchText(section, searchString)); },
    selectPlanLife: (section, plan, rfpQuoteAncillaryOptionId, isSecond) => { dispatch(selectPlanLife(section, plan, rfpQuoteAncillaryOptionId, isSecond)); },
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
    addAlternativePlan: (section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index) => { dispatch(selectSecondPlan(section, plan, rfpQuoteNetworkPlanId, rfpQuoteOptionNetworkId, actionType, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PlanList);

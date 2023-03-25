import { connect } from 'react-redux';
import { changeFavourite } from '../../actions';
import RowView from './RowView';

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const overviewState = state.get('presentation').get(section);
  // const alternativesPlans = overviewState.get('alternativesPlans').toJS();
  const allPlans = overviewState.get('allPlans').toJS();
  const allRx = overviewState.get('allRx').toJS();
  const { rfpQuoteNetworkId, networkName } = detailedPlan;
  let currentPlan = {};
  let currentRxPlan = {};
  if (allPlans && allPlans.length > 0) {
    for (let i = 0; i < allPlans.length; i += 1) {
      if (allPlans[i].type === 'current') {
        currentPlan = allPlans[i];
        break;
      }
    }
  }
  if (allRx && allRx.length > 0) {
    for (let i = 0; i < allRx.length; i += 1) {
      if (allRx[i].type === 'current') {
        currentRxPlan = allRx[i];
        break;
      }
    }
  }

  if (Object.keys(currentRxPlan).length === 0 && allRx.length > 0) {
    currentRxPlan = currentPlan.rx && currentPlan.rx.length ? currentPlan.rx : {};
    if (Object.keys(currentRxPlan).length) allRx.unshift(currentPlan);
  }

  return {
    section,
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    loading: overviewState.get('loading'),
    planTemplate: overviewState.get('planTemplate').toJS(),
    currentPlan,
    currentRxPlan,
    allPlans,
    allRx,
    rfpQuoteNetworkId,
    networkName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RowView);


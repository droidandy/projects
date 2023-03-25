import { connect } from 'react-redux';
import { changeFavourite } from '../../actions';
import RowViewLife from './RowViewLife';

function mapStateToProps(state, ownProps) {
  const { section } = ownProps;
  const overviewState = state.get('presentation').get(section);
  const openedOption = overviewState.get('openedOption');
  const detailedPlan = openedOption.get('detailedPlan');
  // const alternativesPlans = overviewState.get('alternativesPlans').toJS();
  const allPlans = detailedPlan.get('plans').toJS();
  const { rfpQuoteNetworkId, networkName } = detailedPlan;
  let currentPlan = overviewState.get('currentPlan').toJS();
  if (!currentPlan || !Object.keys(currentPlan).length) {
    currentPlan = (detailedPlan && detailedPlan.currentPlan) ? detailedPlan.currentPlan : {};
  }
  return {
    section,
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    loading: overviewState.get('loading'),
    planTemplate: overviewState.get('planTemplate').toJS(),
    currentPlan,
    allPlans,
    rfpQuoteNetworkId,
    networkName,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFavourite: (section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index) => { dispatch(changeFavourite(section, favorite, rfpQuoteNetworkId, rfpQuoteNetworkPlanId, index)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RowViewLife);


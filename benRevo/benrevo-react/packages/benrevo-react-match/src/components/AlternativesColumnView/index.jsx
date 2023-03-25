import { connect } from 'react-redux';
import { getMode, editPlan } from '@benrevo/benrevo-react-quote';
import ColumnView from './ColumnView';
import { changeAccordion } from './../../actions';

function mapStateToProps(state, ownProps) {
  const { section, detailedPlan } = ownProps;
  const { networkName } = detailedPlan;
  const overviewState = state.get('presentation').get(section);
  const matchPlan = overviewState.get('matchPlan').toJS();
  const selectedPlan = overviewState.get('selectedPlan').toJS();
  const alternativePlans = overviewState.get('alternativePlans').toJS();
  const allPlans = overviewState.get('allPlans').toJS();
  const allPlansWithoutCurrent = allPlans && allPlans.length > 0 ? allPlans.filter((d) => d.type !== 'current') : allPlans;
  const allRx = overviewState.toJS().allRx ? overviewState.get('allRx').toJS() : [];
  const allRxPlansWithoutCurrent = allRx && allRx.length > 0 ? allRx.filter((d) => d.type !== 'current') : [];
  const currentPlan = (detailedPlan && detailedPlan.currentPlan) ? detailedPlan.currentPlan : {};
  let currentRx = allRx.filter((d) => d.type === 'current');
  if (currentRx.length === 0 && allRx.length > 0) {
    currentRx = currentPlan.rx && currentPlan.rx.length ? [currentPlan] : [];
  }

  return {
    section,
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    loading: overviewState.get('loading'),
    planTemplate: overviewState.get('planTemplate').toJS(),
    alternativesPlans: overviewState.get('alternativesPlans').toJS(),
    openedOption: overviewState.get('openedOption').toJS(),
    allPlans: allPlansWithoutCurrent,
    allRx: allRxPlansWithoutCurrent,
    currentRx,
    alternativePlans,
    currentPlan,
    matchPlan,
    selectedPlan,
    networkName,
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    editAltPlan: (section, plan, rfpQuoteNetworkId, networkIndex, multiMode) => { dispatch(editPlan(section, plan, rfpQuoteNetworkId, networkIndex, multiMode)); },
    changeAccordionIndex: (accordionActiveIndex) => { dispatch(changeAccordion(accordionActiveIndex)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ColumnView);

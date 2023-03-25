import { connect } from 'react-redux';
import ComparePlans from './ComparePlans';
import {
  getPlansListForFilterCompare,
  changeSelectedClientPlanId,
  changeSelectedClientPlanCarrier,
  changeSelectedSection,
  updateComparePlansList,
  getPlansTemplates,
  downloadComparePlansList,
} from './../../actions';

function mapStateToProps(state, ownProps) {
  const compareState = state.get('presentation').get('comparePlans');
  const sectionSelected = compareState.get('sectionSelected');
  const overviewState = state.get('presentation').get(sectionSelected.toLowerCase());
  const clientPlans = compareState.get('clientPlans').toJS();
  const clientPlanSelected = compareState.get('clientPlanSelected');
  const clientPlanCarriersSelected = compareState.get('clientPlanCarriersSelected').toJS();
  const { clientId } = ownProps.params;
  const openedOption = overviewState.get('openedOption') || Map({});
  const detailedPlan = openedOption && openedOption.get('detailedPlan') && openedOption.get('detailedPlan').toJS();
  return {
    clientId,
    sectionSelected,
    clientPlans,
    clientPlanSelected,
    clientPlanCarriersSelected,
    detailedPlan,
    planFilterChanged: compareState.toJS().planFilterChanged,
    allPlansToCompare: compareState.get('allPlansToCompare').toJS(),
    allOptionsToCompare: compareState.get('allOptionsToCompare').toJS(),
    planTypeTemplates: overviewState.get('planTypeTemplates').toJS(),
    clientPlansLoading: compareState.get('clientPlansLoading'),
    loading: compareState.get('loading'),
    planTemplate: overviewState.get('planTemplate').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPlansTemplates: (section) => { dispatch(getPlansTemplates(section)); },
    getPlansListForFilterCompare: (clientId) => { dispatch(getPlansListForFilterCompare(clientId)); },
    changeSelectedSection: (section) => { dispatch(changeSelectedSection(section)); },
    changeSelectedClientPlanId: (plan) => { dispatch(changeSelectedClientPlanId(plan)); },
    changeSelectedClientPlanCarrier: (carriersSelected) => { dispatch(changeSelectedClientPlanCarrier(carriersSelected)); },
    updateComparePlansList: (product, carrierIds, clientPlanId, clientId) => { dispatch(updateComparePlansList(product, carrierIds, clientPlanId, clientId)); },
    downloadComparePlansList: (product, carrierIds, clientPlanId, clientId) => { dispatch(downloadComparePlansList(product, carrierIds, clientPlanId, clientId)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ComparePlans);

import { connect } from 'react-redux';
import {
  refreshPresentationData,
  openedOptionClear,
  addNetwork,
  deleteNetwork,
  changeOptionNetwork,
  getPlans,
  getMode,
  addOptionForNewProducts,
} from '@benrevo/benrevo-react-quote';
import DetailsPage from './DetailsPage';
import { clearAlternatives, getPlansTemplates, getAnotherOptions } from '../actions';

function mapStateToProps(state, ownProps) {
  const section = ownProps.section || ownProps.routes[4].path;
  const { clientId } = ownProps.params;
  const overviewState = state.get('presentation').get(section);
  const openedOption = overviewState.get('openedOption').toJS();
  const violationNotification = overviewState.get('violationNotification') ? overviewState.get('violationNotification').toJS() : null;
  return {
    clientId,
    section,
    plansGetError: overviewState.get('plansGetError'),
    plansGetSuccess: overviewState.get('plansGetSuccess'),
    alternativesLoading: overviewState.get('alternativesLoading'),
    openedOption,
    page: overviewState.get('page').toJS(),
    load: overviewState.get('load').get('overview'),
    loading: overviewState.get('loading'),
    multiMode: getMode(overviewState.get('page').get('carrier').toJS()),
    violationStatus: violationNotification ? violationNotification[openedOption.id] : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPlansTemplates: (section) => { dispatch(getPlansTemplates(section)); },
    openedOptionClear: (section) => { dispatch(openedOptionClear(section)); },
    refreshPresentationData: (section, carrier, id, loading, kaiser, optionType, excludes, showAllNetworks) => { dispatch(refreshPresentationData(section, carrier, id, loading, kaiser, optionType, excludes, showAllNetworks)); },
    addNetwork: (section, optionId, networkId, clientPlanId, multiMode) => { dispatch(addNetwork(section, optionId, networkId, clientPlanId, multiMode)); },
    deleteNetwork: (section, optionId, networkId) => { dispatch(deleteNetwork(section, optionId, networkId)); },
    changeOptionNetwork: (section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId, multiMode, isNetworkId) => { dispatch(changeOptionNetwork(section, optionId, rfpQuoteNetworkId, rfpQuoteOptionNetworkId, multiMode, isNetworkId)); },
    getAllPlans: (section, networkIndex, multiMode, clearFilter) => { dispatch(getPlans(section, networkIndex, multiMode, clearFilter)); },
    clearPlans: (section) => { dispatch(clearAlternatives(section)); },
    addOptionForNewProducts: (option, section) => { dispatch(addOptionForNewProducts(option, section)); },
    getAnotherOptions: (section) => { dispatch(getAnotherOptions(section)); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage);

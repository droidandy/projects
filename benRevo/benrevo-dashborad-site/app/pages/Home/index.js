import { connect } from 'react-redux';
import Home from './Home';
import {
  changeFilter,
  changeVolumeGroup,
  getBrokerVolume,
  getMarketPositions,
  getQuoteDifference,
  getClients,
  clearFilter,
  changeMarketProduct,
  changeVolumeProduct,
  changeIncumbentProduct,
  getFilters,
  getProbabilityStats,
  changeProbabilityProduct,
  getClientsAtRisk,
  getUpcomingRenewalClients,
  getFunnelData,
  getTopClients,
  changeQY,
} from './actions';
import { setFilter } from '../Clients/actions';
import { makeChart, makeVolumeGroups, selectMarketPositions, selectQuoteDifference } from './selectors';
import { makeProducts } from '../App/selectors';

function mapStateToProps(state) {
  const profileState = state.get('profile');
  const dashboardState = state.get('dashboard');
  return {
    role: profileState.get('brokerageRole').toJS(),
    loading: dashboardState.get('loading'),
    filtersLoaded: dashboardState.get('filtersLoaded'),
    marketProduct: dashboardState.get('marketProduct'),
    incumbentProduct: dashboardState.get('incumbentProduct'),
    volumeProduct: dashboardState.get('volumeProduct'),
    riskProduct: dashboardState.get('riskProduct'),
    maxDiff: dashboardState.get('maxDiff'),
    minDiff: dashboardState.get('minDiff'),
    filters: dashboardState.get('filters').toJS(),
    filterCarriers: dashboardState.get('filterCarriers').toJS(),
    filterBrokerages: dashboardState.get('filterBrokerages').toJS(),
    filterSales: dashboardState.get('filterSales').toJS(),
    volumeGroup: dashboardState.get('volumeGroup'),
    groupsTotal: dashboardState.get('groupsTotal'),
    membersTotal: dashboardState.get('membersTotal'),
    probabilityProduct: dashboardState.get('probabilityProduct'),
    brokerVolume: dashboardState.get('brokerVolume').toJS(),
    marketPositions: selectMarketPositions(state),
    quoteDifference: selectQuoteDifference(state),
    clients: dashboardState.get('clients').toJS(),
    riskClients: dashboardState.get('riskClients').toJS(),
    chart: makeChart(state),
    productsList: makeProducts(),
    volumeGroups: makeVolumeGroups(),
    probabilityStats: dashboardState.get('probabilityStats').toJS(),
    riskLoading: dashboardState.get('riskLoading'),
    upcomingClients: dashboardState.get('upcomingClients').toJS(),
    upcomingLoading: dashboardState.get('upcomingLoading'),
    upcomingProduct: dashboardState.get('upcomingProduct'),
    topClients: dashboardState.get('topClients').toJS(),
    discountStats: dashboardState.get('discountStats').toJS(),
    discountLoading: dashboardState.get('discountLoading'),
    funnelProduct: dashboardState.get('funnelProduct'),
    funnelData: dashboardState.get('funnelData').toJS(),
    quarterYear: dashboardState.get('quarterYear'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFilter: (type, value) => { dispatch(changeFilter(type, value)); },
    changeVolumeGroup: (value) => { dispatch(changeVolumeGroup(value)); },
    changeMarketProduct: (value) => { dispatch(changeMarketProduct(value)); },
    changeIncumbentProduct: (value) => { dispatch(changeIncumbentProduct(value)); },
    changeVolumeProduct: (value) => { dispatch(changeVolumeProduct(value)); },
    getBrokerVolume: () => { dispatch(getBrokerVolume()); },
    getMarketPositions: () => { dispatch(getMarketPositions()); },
    getQuoteDifference: () => { dispatch(getQuoteDifference()); },
    getClients: () => { dispatch(getClients()); },
    setFilter: (filters) => { dispatch(setFilter(filters)); },
    clearFilter: () => { dispatch(clearFilter()); },
    getFilters: (product) => { dispatch(getFilters(product)); },
    getProbabilityStats: (product) => { dispatch(getProbabilityStats(product)); },
    changeProbabilityProduct: (product) => { dispatch(changeProbabilityProduct(product)); },
    getClientsAtRisk: (product) => { dispatch(getClientsAtRisk(product)); },
    getUpcomingRenewalClients: (product) => { dispatch(getUpcomingRenewalClients(product)); },
    getFunnelData: (value) => { dispatch(getFunnelData(value)); },
    getTopClients: () => { dispatch(getTopClients()); },
    changeQY: (value) => { dispatch(changeQY(value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

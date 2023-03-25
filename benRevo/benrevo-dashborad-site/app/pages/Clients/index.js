import { connect } from 'react-redux';
import Clients from './Clients';
import { changeFilter, getClients, clearFilter, changeClientsSort, setFilter, getFilters } from './actions';
import { toggleTopClient } from '../Home/actions';
import { makeProducts } from '../App/selectors';
import { sortClients } from './selectors';

function mapStateToProps(state) {
  const profileState = state.get('profile');
  const clientsState = state.get('clientsList');
  const dashboardState = state.get('dashboard');
  return {
    filtersLoaded: clientsState.get('filtersLoaded'),
    role: profileState.get('brokerageRole').toJS(),
    loading: clientsState.get('loading'),
    filters: clientsState.get('filters').toJS(),
    clients: sortClients(state),
    sort: clientsState.get('sort').toJS(),
    productsList: makeProducts(),
    maxDiff: clientsState.get('maxDiff'),
    minDiff: clientsState.get('minDiff'),
    filterCarriers: clientsState.get('filterCarriers').toJS(),
    filterBrokerages: clientsState.get('filterBrokerages').toJS(),
    filterSales: clientsState.get('filterSales').toJS(),
    togglingIds: dashboardState.get('togglingIds').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeFilter: (type, value) => { dispatch(changeFilter(type, value)); },
    getClients: () => { dispatch(getClients()); },
    clearFilter: () => { dispatch(clearFilter()); },
    changeClientsSort: (prop, order) => { dispatch(changeClientsSort(prop, order)); },
    setFilter: (filters) => { dispatch(setFilter(filters)); },
    getFilters: (product) => { dispatch(getFilters(product)); },
    toggleTopClient: (client, check) => { dispatch(toggleTopClient(client, check)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients);

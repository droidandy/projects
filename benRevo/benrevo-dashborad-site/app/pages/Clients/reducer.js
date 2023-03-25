import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import * as types from './constants';
import * as appTypes from '../App/constants';
import * as dashboardTypes from '../Home/constants';
import { createFilterData } from '../../utils/query';

// The initial state of the App
const initialState = fromJS({
  filters: {
    effectiveDate: [],
    difference: [],
    carriers: [],
    product: appTypes.MEDICAL_SECTION.toUpperCase(),
    clientName: '',
    sales: [],
    presales: [],
    brokers: [],
    clientStates: [dashboardTypes.QUOTED_STATE, dashboardTypes.PENDING_APPROVAL_STATE],
    competitiveInfoCarrier: {},
  },
  filtersLoaded: false,
  filterBrokerages: [],
  filterSales: [],
  filterCarriers: [],
  minDiff: 0,
  maxDiff: 0,
  clients: [],
  loading: false,
  sort: {
    prop: 'competitiveVsCurrent',
    order: 'ascending',
  },
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case appTypes.CLEAR:
      return state
        .setIn(['filtersLoaded'], false)
        .setIn(['clients'], fromJS([]));
    case types.SET_FILTER: {
      const currentFilters = action.payload;
      let clients = state.get('clients');
      let newFilters = initialState.get('filters');

      if (!isEqual(currentFilters, newFilters.toJS())) clients = fromJS([]);

      Object.keys(currentFilters).map((key) => {
        if (newFilters.has(key)) newFilters = newFilters.set(key, fromJS(currentFilters[key]));

        return true;
      });

      if (!currentFilters.product) newFilters = newFilters.set('product', state.get('filters').get('product'));

      return state
        .setIn(['clients'], clients)
        .setIn(['filters'], fromJS(newFilters));
    }
    case types.CHANGE_CLIENTS_FILTER: {
      let data = action.payload.value;

      if (action.payload.type === 'clientStates' && !action.payload.value.length) data = initialState.get('filters').get('clientStates');

      return state
        .setIn(['filters', action.payload.type], fromJS(data));
    }
    case types.CLEAR_FILTER: {
      return state
        .setIn(['filters'], initialState.get('filters'))
        .setIn(['filters', 'product'], state.get('filters').get('product'));
    }
    case types.CLIENTS_GET:
      return state
        .set('loading', true);
    case types.CLIENTS_GET_SUCCESS: {
      const clients = action.payload;
      for (let i = 0; i < clients.length; i += 1) {
        const client = clients[i];
        if (!client.employeeCount) client.employeeCount = 0;
        if (!client.diffPercent) client.diffPercent = 0;
        if (!client.topClient) client.topClient = false;
      }
      const topClients = clients.filter((item) => item.topClient);
      return state
        .set('loading', false)
        .set('topClients', fromJS(topClients))
        .set('clients', fromJS(clients));
    }
    case types.CLIENTS_GET_ERROR:
      return state
        .set('loading', false);
    case types.CHANGE_CLIENTS_SORT: {
      const prop = action.payload.prop;
      let sort = state.get('sort');
      if (sort.get('prop') === prop) {
        if (sort.get('order') === 'ascending') sort = sort.set('order', 'descending');
        else {
          sort = sort.set('order', 'ascending');
        }
      } else {
        sort = sort.set('prop', prop).set('order', 'ascending');
      }

      return state
        .setIn(['sort'], sort);
    }
    case types.FILTERS_GET_SUCCESS: {
      const data = createFilterData(action.payload);
      return state
        .setIn(['filterCarriers'], fromJS(data.filterCarriers))
        .setIn(['filterBrokerages'], fromJS(data.filterBrokerages))
        .setIn(['filterSales'], fromJS(data.filterSales))
        .setIn(['minDiff'], data.lastDif)
        .setIn(['maxDiff'], data.firstDif)
        .setIn(['filtersLoaded'], true);
    }
    case types.FILTERS_GET_ERROR:
      return state
        .setIn(['filtersLoaded'], true);
    default:
      return state;
  }
}

export default dashboardReducer;

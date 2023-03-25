import { fromJS } from 'immutable';
import moment from 'moment';
import * as types from './constants';
import * as appTypes from '../App/constants';
import { createFilterData } from '../../utils/query';

// The initial state of the App
const initialState = fromJS({
  filters: {
    effectiveDate: [],
    difference: [-30, 100],
    carriers: [],
    product: appTypes.MEDICAL_SECTION.toUpperCase(),
    sales: [],
    presales: [],
    brokers: [],
    clientStates: [types.QUOTED_STATE, types.PENDING_APPROVAL_STATE],
    competitiveInfoCarrier: {},
  },
  filtersLoaded: false,
  clientsTotal: 0,
  filterBrokerages: [],
  filterSales: [],
  filterCarriers: [],
  minDiff: 0,
  maxDiff: 0,
  marketProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  volumeProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  incumbentProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  probabilityProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  riskProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  upcomingProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  funnelProduct: appTypes.MEDICAL_SECTION.toUpperCase(),
  volumeGroup: types.ACTIVE,
  funnelData: {},
  brokerVolume: [],
  marketPositions: [],
  quoteDifference: [],
  groupsTotal: 0,
  membersTotal: 0,
  clients: [],
  topClients: [],
  topClientIds: [],
  togglingIds: [],
  riskClients: fromJS([]),
  riskLoading: false,
  upcomingClients: [],
  upcomingLoading: false,
  loading: false,
  discountStats: {
    closedGroupCount: 0,
    pendingGroupCount: 0,
    totalGroupCount: 0,
    closedGroupEmployeeCount: 0,
    pendingGroupEmployeeCount: 0,
    totalGroupEmployeeCount: 0,
    closedGroupDiscounts: 0,
    pendingGroupDiscounts: 0,
    totalGroupDiscounts: 0,
    salesPersons: [],
  },
  discountLoading: false,
  probabilityStats: {},
  quarterYear: `Q${moment().quarter()} ${moment().year()}`,
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case appTypes.CLEAR:
      return state
      .setIn(['filtersLoaded'], false)
      .setIn(['clients'], fromJS([]));
    case types.CHANGE_FILTER: {
      let data = action.payload.value;

      if (action.payload.type === 'clientStates' && !action.payload.value.length) data = initialState.get('filters').get('clientStates');

      return state
        .setIn(['filters', action.payload.type], fromJS(data));
    }
    case types.CHANGE_MARKET_PRODUCT:
      return state
      .setIn(['marketProduct'], action.payload);
    case types.CHANGE_INCUMBENT_PRODUCT:
      return state
      .setIn(['incumbentProduct'], action.payload);
    case types.CHANGE_VOLUME_PRODUCT:
      return state
      .setIn(['volumeProduct'], action.payload);
    case types.CLEAR_FILTER: {
      return state
        .setIn(['filters'], initialState.get('filters'))
        .setIn(['filters', 'product'], state.get('filters').get('product'))
        .setIn(['filters', 'difference'], fromJS([]));
    }
    case types.CHANGE_VOLUME_GROUP:
      return state
      .setIn(['volumeGroup'], action.payload);
    case types.CLIENTS_GET:
      return state
        .set('loading', true);
    case types.CLIENTS_GET_SUCCESS: {
      const clients = action.payload;
      for (let i = 0; i < clients.length; i += 1) {
        const client = clients[i];
        if (!client.employeeCount) client.employeeCount = 0;
        if (!client.diffPercent) client.diffPercent = 0;
      }
      return state
        .set('loading', false)
        .set('clients', fromJS(clients));
    }
    case types.CLIENTS_GET_ERROR:
      return state
        .set('loading', false);
    case types.BROKER_VOLUME_GET_SUCCESS:
      return state
      .setIn(['brokerVolume'], fromJS(action.payload.items))
      .setIn(['groupsTotal'], action.payload.groupsTotal)
      .setIn(['membersTotal'], action.payload.membersTotal);
    case types.MARKET_POSITIONS_GET_SUCCESS:
      return state
      .setIn(['marketPositions'], fromJS(action.payload));
    case types.QUOTE_DIFFERENCE_GET_SUCCESS:
      return state
      .setIn(['quoteDifference'], fromJS(action.payload));
    case types.FILTERS_GET_SUCCESS: {
      const data = createFilterData(action.payload);
      return state
        .setIn(['filterCarriers'], fromJS(data.filterCarriers))
        .setIn(['filterBrokerages'], fromJS(data.filterBrokerages))
        .setIn(['filterSales'], fromJS(data.filterSales))
        .setIn(['minDiff'], data.lastDif)
        .setIn(['maxDiff'], data.firstDif)
        .setIn(['clientsTotal'], action.payload.clientsTotalCount)
        .setIn(['filtersLoaded'], true);
    }
    case types.FILTERS_GET_ERROR:
      return state
      .setIn(['filtersLoaded'], true);
    case types.CHANGE_PROBABILITY_PRODUCT:
      return state
        .setIn(['probabilityProduct'], action.payload);
    case types.GET_PROBABILITY_STATS_SUCCESS:
      return state
        .set('probabilityStats', fromJS(action.payload));
    case types.GET_CLIENTS_AT_RISK:
      return state
        .set('riskProduct', action.payload)
        .set('riskLoading', true);
    case types.GET_UPCOMING_RENEWAL:
      return state
        .set('upcomingProduct', action.payload)
        .set('upcomingLoading', true);
    case types.GET_CLIENTS_AT_RISK_SUCCESS: {
      const clients = action.payload;
      for (let i = 0; i < clients.length; i += 1) {
        const client = clients[i];
        if (!client.employeeCount) client.employeeCount = 0;
        if (!client.diffPercent) client.diffPercent = 0;
      }
      return state
        .set('riskClients', fromJS(clients))
        .set('riskLoading', false);
    }
    case types.GET_UPCOMING_RENEWAL_SUCCESS: {
      const clients = action.payload;
      for (let i = 0; i < clients.length; i += 1) {
        const client = clients[i];
        if (!client.employeeCount) client.employeeCount = 0;
        if (!client.diffPercent) client.diffPercent = 0;
      }
      return state
        .set('upcomingClients', fromJS(clients))
        .set('upcomingLoading', false);
    }
    case types.GET_CLIENTS_AT_RISK_ERROR:
      return state
        .set('riskLoading', false);
    case types.GET_UPCOMING_RENEWAL_ERROR:
      return state
        .set('upcomingLoading', false);
    case types.GET_DISCOUNT_STATS_SUCCESS:
      return state
        .set('discountStats', fromJS(action.payload))
        .set('discountLoading', false);
    case types.GET_DISCOUNT_STATS_ERROR:
      return state
        .set('discountLoading', false);
    case types.GET_FUNNEL_DATA:
      return state
        .set('funnelProduct', action.payload);
    case types.GET_FUNNEL_DATA_SUCCESS:
      return state
        .set('funnelData', fromJS(action.payload));
    case types.TOP_CLIENTS_GET_SUCCESS:
      return state
        .set('topClients', fromJS(action.payload))
        .set('topClientIds', fromJS(action.payload.map((item) => item.clientId)));
    case types.TOGGLE_TOP_CLIENT: {
      const topClients = state.get('topClients').toJS();
      const topClientIds = state.get('topClientIds').toJS();
      const togglingIds = state.get('togglingIds').toJS();
      let finalTopClients = topClients;
      const finalTopClientIds = topClientIds;
      const clientId = action.payload.client.clientId;
      const index = topClientIds.indexOf(clientId);
      if (index > -1) {
        finalTopClientIds.splice(index, 1);
        finalTopClients = topClients.filter((item) => item.clientId !== clientId);
      } else {
        finalTopClientIds.push(clientId);
        finalTopClients.push(action.payload.client);
      }
      togglingIds.push(clientId);
      return state
        .set('topClients', fromJS(finalTopClients))
        .set('topClientIds', fromJS(finalTopClientIds))
        .set('togglingIds', fromJS(togglingIds));
    }
    case types.TOGGLE_TOP_CLIENT_SUCCESS: {
      const togglingIds = state.get('togglingIds').toJS();
      const clients = state.get('clients').toJS();
      const client = action.payload.client;
      const topClientIndex = client.clientAttributes.indexOf(types.TOP_CLIENT_ATT);
      if (topClientIndex === -1) {
        client.clientAttributes.push(types.TOP_CLIENT_ATT);
      } else {
        client.clientAttributes.splice(topClientIndex, 1);
      }
      const clientId = client.clientId;
      const index = clients.map((item) => item.clientId).indexOf(clientId);
      togglingIds.shift();
      return state
        .set('togglingIds', fromJS(togglingIds))
        .setIn(['clients', index], fromJS(client));
    }
    case types.TOGGLE_TOP_CLIENT_ERROR: {
      const togglingIds = state.get('togglingIds').toJS();
      togglingIds.shift();
      return state
        .set('togglingIds', fromJS(togglingIds));
    }
    case types.CHANGE_QUARTER_YEAR:
      return state
        .set('discountLoading', true)
        .set('quarterYear', action.payload);
    default:
      return state;
  }
}

export default dashboardReducer;

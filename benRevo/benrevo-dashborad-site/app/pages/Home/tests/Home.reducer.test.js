import { fromJS } from 'immutable';
import moment from 'moment';
import reducer from '../reducer';
import * as types from '../constants';
import * as appTypes from '../../App/constants';
import { createFilterData } from '../../../utils/query';

describe('BrokeragePageReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
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
  });

  it('CLEAR', () => {
    const mockAction = { type: appTypes.CLEAR };
    const mockState = state
      .setIn(['filtersLoaded'], false)
      .setIn(['clients'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_FILTER', () => {
    const mockAction = { type: types.CHANGE_FILTER, payload: { type: 'product', value: 'DENTAL' } };
    const data = mockAction.payload.value;
    const mockState = state
      .setIn(['filters', mockAction.payload.type], fromJS(data));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_MARKET_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_MARKET_PRODUCT, payload: 'test123' };
    const mockState = state
      .setIn(['marketProduct'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_INCUMBENT_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_INCUMBENT_PRODUCT, payload: 'test123' };
    const mockState = state
      .setIn(['incumbentProduct'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_VOLUME_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_VOLUME_PRODUCT, payload: 'test123' };
    const mockState = state
      .setIn(['volumeProduct'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLEAR_FILTER', () => {
    const mockAction = { type: types.CLEAR_FILTER };
    const mockState = state
      .setIn(['filters'], state.get('filters'))
      .setIn(['filters', 'product'], state.get('filters').get('product'))
      .setIn(['filters', 'difference'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_VOLUME_GROUP', () => {
    const mockAction = { type: types.CHANGE_VOLUME_GROUP, payload: 'test123' };
    const mockState = state
      .setIn(['volumeGroup'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENTS_GET', () => {
    const mockAction = { type: types.CLIENTS_GET };
    const mockState = state
      .setIn(['loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENTS_GET_SUCCESS', () => {
    const mockAction = { type: types.CLIENTS_GET_SUCCESS, payload: [{ test: 'testData' }] };
    const clients = mockAction.payload;
    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      if (!client.employeeCount) client.employeeCount = 0;
      if (!client.diffPercent) client.diffPercent = 0;
    }
    const mockState = state
      .set('loading', false)
      .set('clients', fromJS(clients));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CLIENTS_GET_ERROR', () => {
    const mockAction = { type: types.CLIENTS_GET_ERROR };
    const mockState = state
      .setIn(['loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BROKER_VOLUME_GET_SUCCESS', () => {
    const mockAction = { type: types.BROKER_VOLUME_GET_SUCCESS, payload: { items: ['coolio'], groupsTotal: 10, membersTotal: 10 } };
    const mockState = state
      .setIn(['brokerVolume'], fromJS(mockAction.payload.items))
      .setIn(['groupsTotal'], mockAction.payload.groupsTotal)
      .setIn(['membersTotal'], mockAction.payload.membersTotal);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('MARKET_POSITIONS_GET_SUCCESS', () => {
    const mockAction = { type: types.MARKET_POSITIONS_GET_SUCCESS, payload: ['test123!'] };
    const mockState = state
      .setIn(['marketPositions'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('QUOTE_DIFFERENCE_GET_SUCCESS', () => {
    const mockAction = { type: types.QUOTE_DIFFERENCE_GET_SUCCESS, payload: ['test123!'] };
    const mockState = state
      .setIn(['quoteDifference'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FILTERS_GET_SUCCESS', () => {
    const mockAction = {
      type: types.FILTERS_GET_SUCCESS,
      payload: {
        product: 'MEDICAL',
        brokerages: [{ name: 'test', id: 1 }],
        incumbentCarriers: [{ name: 'a', id: 1 }],
        presales: [{ name: 'b', id: 3 }],
        sales: [{ name: 'c', id: 1 }],
        diffPercentFrom: -100.0,
        diffPercentTo: 200,
        clientsTotalCount: 34,
      },
    };
    const data = createFilterData(mockAction.payload);
    const mockState = state
      .setIn(['filterCarriers'], fromJS(data.filterCarriers))
      .setIn(['filterBrokerages'], fromJS(data.filterBrokerages))
      .setIn(['filterSales'], fromJS(data.filterSales))
      .setIn(['minDiff'], data.lastDif)
      .setIn(['maxDiff'], data.firstDif)
      .setIn(['clientsTotal'], mockAction.payload.clientsTotalCount)
      .setIn(['filtersLoaded'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FILTERS_GET_ERROR', () => {
    const mockAction = { type: types.FILTERS_GET_ERROR };
    const mockState = state
      .setIn(['filtersLoaded'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CLIENTS_AT_RISK', () => {
    const mockAction = { type: types.GET_CLIENTS_AT_RISK, payload: 'test123' };
    const mockState = state
      .set('riskProduct', mockAction.payload)
      .set('riskLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_UPCOMING_RENEWAL', () => {
    const mockAction = { type: types.GET_UPCOMING_RENEWAL, payload: 'test123' };
    const mockState = state
      .set('upcomingProduct', mockAction.payload)
      .set('upcomingLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CLIENTS_AT_RISK_SUCCESS', () => {
    const mockAction = { type: types.GET_CLIENTS_AT_RISK_SUCCESS, payload: [{ test: 'testData' }] };
    const clients = mockAction.payload;
    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      if (!client.employeeCount) client.employeeCount = 0;
      if (!client.diffPercent) client.diffPercent = 0;
    }
    const mockState = state
      .set('riskClients', fromJS(clients))
      .set('riskLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_UPCOMING_RENEWAL_SUCCESS', () => {
    const mockAction = { type: types.GET_UPCOMING_RENEWAL_SUCCESS, payload: [{ test: 'testData' }] };
    const clients = mockAction.payload;
    for (let i = 0; i < clients.length; i += 1) {
      const client = clients[i];
      if (!client.employeeCount) client.employeeCount = 0;
      if (!client.diffPercent) client.diffPercent = 0;
    }
    const mockState = state
      .set('upcomingClients', fromJS(clients))
      .set('upcomingLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CLIENTS_AT_RISK_ERROR', () => {
    const mockAction = { type: types.GET_CLIENTS_AT_RISK_ERROR };
    const mockState = state
      .set('riskLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_DISCOUNT_STATS_SUCCESS', () => {
    const mockAction = { type: types.GET_DISCOUNT_STATS_SUCCESS, payload: ['cool data'] };
    const mockState = state
      .set('discountStats', fromJS(mockAction.payload))
      .set('discountLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_DISCOUNT_STATS_ERROR', () => {
    const mockAction = { type: types.GET_DISCOUNT_STATS_ERROR };
    const mockState = state
      .set('discountLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('CHANGE_PROBABILITY_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_PROBABILITY_PRODUCT, payload: 'test' };
    const mockState = state
      .setIn(['probabilityProduct'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PROBABILITY_STATS_SUCCESS', () => {
    const mockAction = { type: types.GET_PROBABILITY_STATS_SUCCESS, payload: { test: 'testData' } };
    const mockState = state
      .set('probabilityStats', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_FUNNEL_DATA', () => {
    const mockAction = { type: types.GET_FUNNEL_DATA, payload: 'coolio' };
    const mockState = state
      .set('funnelProduct', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_FUNNEL_DATA_SUCCESS', () => {
    const mockAction = { type: types.GET_FUNNEL_DATA_SUCCESS, payload: { test: 'testData' } };
    const mockState = state
      .set('funnelData', fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('TOP_CLIENTS_GET_SUCCESS', () => {
    const mockAction = { type: types.TOP_CLIENTS_GET_SUCCESS, payload: [{ clientId: 123 }] };
    const mockState = state
      .set('topClients', fromJS(mockAction.payload))
      .set('topClientIds', fromJS(mockAction.payload.map((item) => item.clientId)));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('TOGGLE_TOP_CLIENT', () => {
    const mockAction = { type: types.TOGGLE_TOP_CLIENT, payload: { client: { clientId: 123 } } };
    const topClients = state.get('topClients').toJS();
    const topClientIds = state.get('topClientIds').toJS();
    const togglingIds = state.get('togglingIds').toJS();
    const clientId = mockAction.payload.client.clientId;
    topClientIds.push(clientId);
    topClients.push(mockAction.payload.client);
    togglingIds.push(clientId);
    const mockState = state
      .set('topClients', fromJS(topClients))
      .set('topClientIds', fromJS(topClientIds))
      .set('togglingIds', fromJS(togglingIds));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('TOGGLE_TOP_CLIENT_SUCCESS', () => {
    const mockAction = { type: types.TOGGLE_TOP_CLIENT_SUCCESS, payload: { client: { clientId: 123, clientAttributes: [] } } };
    const startState = state
      .set('clients', fromJS([{ clientId: 123, clientAttributes: [] }]))
      .set('togglingIds', fromJS(['123', '456']));
    const mockState = state
      .set('clients', fromJS([{ clientId: 123, clientAttributes: ['TOP_CLIENT'] }]))
      .set('togglingIds', fromJS(['456']));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('TOGGLE_TOP_CLIENT_ERROR', () => {
    const mockAction = { type: types.TOGGLE_TOP_CLIENT_ERROR };
    const startState = state.set('togglingIds', fromJS(['123', '456']));
    const mockState = state
      .set('togglingIds', fromJS(['456']));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('CHANGE_QUARTER_YEAR', () => {
    const mockAction = { type: types.CHANGE_QUARTER_YEAR, payload: 123 };
    const mockState = state
      .set('discountLoading', true)
      .set('quarterYear', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});

/*
 *
 * ClientPage reducer
 *
 */

import { fromJS, Map, List } from 'immutable';
import 'moment/locale/en-gb';
import * as types from './constants';

export const products = fromJS({
  [types.MEDICAL_SECTION]: true,
  [types.DENTAL_SECTION]: true,
  [types.VISION_SECTION]: true,
  [types.LIFE_SECTION]: false,
  [types.STD_SECTION]: false,
  [types.LTD_SECTION]: false,
});

export const virginCoverage = fromJS({
  [types.MEDICAL_SECTION]: false,
  [types.DENTAL_SECTION]: false,
  [types.VISION_SECTION]: false,
  [types.LIFE_SECTION]: false,
  [types.STD_SECTION]: false,
  [types.LTD_SECTION]: false,
});

export const initialState = fromJS({
  products,
  loading: true,
  importLoading: false,
  clientSaveInProgress: false,
  clientSaveFailed: false,
  rfpRouteFailed: false,
  presentationRouteFailed: false,
  onboardingRouteFailed: false,
  timelineRouteFailed: false,
  clientOverride: Map({}),
  clients: [],
  current: newClient(),
  currentChanged: false,
  domesticPartnerCoverages: [
    { text: 'Broad', value: 'Broad' },
    { text: 'Narrow', value: 'Narrow' },
  ],
  sort: {
    prop: 'id',
    order: 'ascending',
  },
});

function newClient(isNew, brokerId) {
  return Map({
    address: '',
    addressComplementary: '',
    brokerId: brokerId || null,
    clientMembers: List([]),
    businessType: '',
    city: '',
    clientName: '',
    clientState: '',
    contactAddress: '',
    contactCity: '',
    contactEmail: '',
    contactFax: '',
    contactName: '',
    contactPhone: '',
    contactState: '',
    contactTitle: '',
    contactZip: '',
    dateQuestionnaireCompleted: '',
    domesticPartner: '',
    dueDate: '',
    effectiveDate: '',
    employeeCount: '',
    employeeTotal: '',
    fedTaxId: '',
    imageUrl: '',
    lastVisited: '',
    membersCount: '',
    minimumHours: '',
    orgType: '',
    outToBidReason: '',
    participatingEmployees: '',
    policyNumber: '',
    retireesCount: '',
    cobraCount: '',
    averageAge: '',
    sicCode: '',
    predominantCounty: '',
    state: '',
    website: '',
    zip: '',
    attributes: [],
    products,
    virginCoverage,
    declinedOutside: false,
    submittedRfpSeparately: false,
    isNew,
  });
}

export function sortClient(clients, sort) {
  const prop = sort.get('prop');
  if (sort.get('order') === 'ascending') {
    clients.sort((a, b) => {
      const aValue = (prop !== 'effectiveDate') ? a[prop] : new Date(a[prop]).getTime();
      const bValue = (prop !== 'effectiveDate') ? b[prop] : new Date(b[prop]).getTime();

      if (typeof aValue === 'number') return aValue - bValue;

      if (aValue > bValue) return 1;
      if (aValue < bValue) return -1;

      return 0;
    });
  } else {
    clients.sort((a, b) => {
      const aValue = (prop !== 'effectiveDate') ? a[prop] : new Date(a[prop]).getTime();
      const bValue = (prop !== 'effectiveDate') ? b[prop] : new Date(b[prop]).getTime();

      if (typeof aValue === 'number') return bValue - aValue;

      if (aValue < bValue) return 1;
      if (aValue > bValue) return -1;

      return 0;
    });
  }

  return fromJS(clients);
}

export function mappingProducts(item) {
  const elem = item;
  let result = products;
  let resultVirgin = virginCoverage;

  if (elem.rfpProducts) {
    result = result
      .set(types.MEDICAL_SECTION, false)
      .set(types.DENTAL_SECTION, false)
      .set(types.VISION_SECTION, false)
      .set(types.LIFE_SECTION, false)
      .set(types.STD_SECTION, false)
      .set(types.LTD_SECTION, false);

    for (let j = 0; j < elem.rfpProducts.length; j += 1) {
      const product = elem.rfpProducts[j];
      const name = product.name.toLowerCase();
      resultVirgin = resultVirgin.set(name, product.virginGroup);

     // if (name === types.MEDICAL_SECTION || name === types.DENTAL_SECTION || name === types.VISION_SECTION) result = result.set(name.toLowerCase(), true); // todo REMOVE!
      result = result.set(name.toLowerCase(), true);
    }
  }

  return { products: result, virginCoverage: resultVirgin };
}

export function mappingClientState(item) {
  let clientState = '';
  const state = item.clientState;
  if (state === types.RFP_SUBMITTED) clientState = types.RFP_SUBMITTED_NORMAL;
  else if (state === types.RFP_STARTED) clientState = types.RFP_STARTED_NORMAL;
  else if (state === types.QUOTED) clientState = types.QUOTED_NORMAL;
  else if (state === types.SUBMITTED_FOR_APPROVAL) clientState = types.SUBMITTED_FOR_APPROVAL_NORMAL;
  else if (state === types.ON_BOARDING) clientState = types.ON_BOARDING_NORMAL;
  else if (state === types.PENDING_APPROVAL) clientState = types.PENDING_APPROVAL_NORMAL;
  else if (state === types.POLICY_FINALIZED) clientState = types.POLICY_FINALIZED_NORMAL;
  else if (state === types.COMPLETED) clientState = types.COMPLETED_NORMAL;
  else if (state === types.WON) clientState = types.WON_NORMAL;
  else if (state === types.SOLD) clientState = types.SOLD_NORMAL;
  else if (state === types.CLOSED) clientState = types.CLOSED_NORMAL;

  return clientState;
}

function clientPageReducer(state = initialState, action) {
  switch (action.type) {
    case types.RESET_CLIENT_INFO: {
      return state
        .set('current', newClient());
    }
    case types.RESET_CLIENTS: {
      return state
        .set('clientSaveInProgress', false);
    }
    case types.UPDATE_CLIENT: {
      let value = action.payload.value;

      if (value === '') value = null;

      return state
        .set('currentChanged', true)
        .set('loading', false)
        .setIn(['current', action.payload.name], value);
    }
    case types.FETCH_CLIENT: {
      return state
        .set('loading', true)
        .set('current', newClient(true, action.payload.brokerId));
    }
    case types.FETCH_CLIENT_SUCCEEDED:
    case types.SAVE_CLIENT_SUCCEEDED: {
      const client = action.payload;
      const result = mappingProducts(client);

      client.clientState = mappingClientState(client);
      client.products = result.products;
      client.virginCoverage = result.virginCoverage;

      if (!client.attributes) client.attributes = [];

      return state
        .set('clientSaveInProgress', false)
        .set('loading', false)
        .set('current', fromJS(client));
    }
    case types.FETCH_CLIENT_FAILED: {
      return state
        .set('loading', false);
    }
    case types.SAVE_CLIENT_FAILED:
      return state
        .set('clientSaveInProgress', false)
        .set('loading', false)
        .set('clientSaveFailed', true);
    case types.SAVE_CLIENT:
      return state
        .set('clientSaveFailed', false)
        .set('loading', false)
        .set('clientSaveInProgress', true);
    case types.QUOTE_NEW_CLIENT:
      return state
        .set('clientSaveInProgress', false)
        .set('clientSaveFailed', false)
        .set('currentChanged', true)
        .set('loading', false)
        .set('current', newClient(true, action.payload.brokerId));
    case types.SELECT_CLIENT:
      return state
        .set('currentChanged', false)
        .set('loading', false)
        .set('rfpRouteFailed', false)
        .set('presentationRouteFailed', false)
        .set('onboardingRouteFailed', false)
        .set('timelineRouteFailed', false)
        .set('current', (action.payload) ? fromJS(action.payload) : newClient(true));
    case types.CLIENTS_SORT: {
      const prop = action.payload.prop;
      const order = action.payload.order;
      let sort = state.get('sort');
      let clients = state.get('clients').toJS();

      if (order) sort = sort.set('order', order);
      else if (sort.get('prop') === prop) {
        if (sort.get('order') === 'ascending') sort = sort.set('order', 'descending');
        else {
          sort = sort.set('order', 'ascending');
        }
      } else {
        sort = sort.set('prop', prop).set('order', 'ascending');
      }

      clients = sortClient(clients, sort);

      return state
        .set('clients', clients)
        .set('sort', sort);
    }
    case types.FETCH_CLIENTS: {
      return state
        .set('loading', true);
    }
    case types.FETCH_CLIENTS_SUCCEEDED: {
     // const sort = state.get('sort');
      let data = action.payload;

      data.map((item, i) => {
        const elem = item;
        const result = mappingProducts(elem);
        data[i].clientState = mappingClientState(elem);
        data[i].products = result.products;
        data[i].virginCoverage = result.virginCoverage;

        if (!elem.attributes) data[i].attributes = [];

        return true;
      });

      // data = sortClient(data, sort);
      data = fromJS(data.reverse());

      return state
        .set('sort', initialState.get('sort'))
        .set('currentChanged', false)
        .set('clients', data)
        .set('clientsSuccessfullyLoaded', true)
        .set('clientsLoadingError', false)
        .set('loading', false);
    }
    case types.CHANGE_SELECTED_PRODUCT: {
      let allow = 0;
      const data = state.get('current').get('products');

      data.valueSeq().forEach((value) => {
        if (value) {
          allow += 1;
        }

        return true;
      });

      if ((allow > 1 && !action.payload.value) || action.payload.value) {
        return state
          .setIn(['current', 'products', action.payload.type], action.payload.value);
      }

      return state;
    }
    case types.CHANGE_VIRGIN_COVERAGE: {
      return state
        .setIn(['current', 'virginCoverage', action.payload.type], action.payload.value);
    }
    case types.FETCH_CLIENTS_FAILED:
      return state
        .set('loading', false)
        .set('clientsLoadingError', true);
    case types.IMPORT_CLIENT: {
      return state
        .set('importLoading', true)
        .set('clientOverride', Map({}));
    }
    case types.IMPORT_CLIENT_SUCCEEDED: {
      if (!action.payload.id) {
        return state
          .set('importLoading', false)
          .set('clientOverride', Map(action.payload));
      }
      return state
        .set('importLoading', false);
    }
    case types.IMPORT_CLIENT_FAILED: {
      return state
        .set('clientOverride', Map({}))
        .set('importLoading', false);
    }
    case types.SET_RFP_ROUTING_STATUS: {
      const status = action.payload.status;

      if (action.payload.type === 'rfp') {
        return state
          .set('rfpRouteFailed', status)
          .set('presentationRouteFailed', !status)
          .set('onboardingRouteFailed', !status)
          .set('timelineRouteFailed', !status);
      } else if (action.payload.type === 'onboarding') {
        return state
          .set('rfpRouteFailed', !status)
          .set('presentationRouteFailed', !status)
          .set('timelineRouteFailed', !status)
          .set('onboardingRouteFailed', status);
      } else if (action.payload.type === 'timeline') {
        return state
          .set('rfpRouteFailed', !status)
          .set('presentationRouteFailed', !status)
          .set('onboardingRouteFailed', !status)
          .set('timelineRouteFailed', status);
      }

      return state.set('presentationRouteFailed', status).set('rfpRouteFailed', !status).set('onboardingRouteFailed', !status);
    }
    default:
      return state;
  }
}

export default clientPageReducer;

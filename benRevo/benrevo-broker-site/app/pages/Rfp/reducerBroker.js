import { fromJS } from 'immutable';
import {
  GET_RFP_STATUS,
  GET_RFP_STATUS_SUCCESS,
  RFP_SUBMITTED_SUCCESS,
} from '@benrevo/benrevo-react-rfp';
import * as types from './constants';

// The initial state of the Rfp
export const initialState = fromJS({
  statusLoaded: false,
  rfpSent: false,
  submitted: false,
  latestSubmitted: 0,
  carrierEmailList: [],
  submissions: [],
  customCarriersEmails: {},
  selectedProducts: {},
  selectedCarriers: {
    medical: {},
    dental: {},
    vision: {},
    life: {},
    std: {},
    ltd: {},
  },
  page: 'check',
});

function rfpReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_RFP_SENT:
      return state
        .set('rfpSent', action.payload);
    case types.SELECT_CLIENTS_CARRIER: {
      const { carrier, section, products } = action.payload;
      const selected = {};
      let selectedCarriers = state.get('selectedCarriers');
      if (selectedCarriers.get(section).get(carrier.carrierId)) {
        selectedCarriers = selectedCarriers.deleteIn([section, carrier.carrierId]);
      } else selectedCarriers = selectedCarriers.setIn([section, carrier.carrierId], fromJS(carrier));

      for (let i = 0; i < Object.keys(products).length; i += 1) {
        const key = Object.keys(products)[i];

        if (products[key]) selected[key] = true;
      }

      return state
        .set('selectedCarriers', fromJS(selectedCarriers))
        .setIn(['selectedProducts', carrier.carrierId], fromJS(selected));
    }
    case types.GET_CARRIER_EMAILS:
      return state
        .set('statusLoaded', false)
        .set('submitted', false)
        .set('submissions', fromJS([]))
        .set('carrierEmailList', fromJS([]));
    case types.CLEAR_CARRIER_DATA:
      return state
        .set('selectedCarriers', initialState.get('selectedCarriers'))
        .set('page', initialState.get('page'));
    case types.GET_CARRIER_EMAILS_SUCCESS: {
      const configData = action.payload;
      const carriers = (configData && configData.length) ? JSON.parse(configData[0].data) : [];
      return state
        .set('loading', false)
        .set('carrierEmailList', fromJS(carriers));
    }
    case types.CHANGE_EMAILS: {
      const { carrier, emails } = action.payload;
      let customCarriersEmails = state.get('customCarriersEmails');

      customCarriersEmails = customCarriersEmails.set(carrier.carrierId, fromJS(emails));

      return state
        .set('customCarriersEmails', customCarriersEmails);
    }
    case types.CHANGE_SELECT: {
      const { carrierId, product, selected } = action.payload;

      return state
        .setIn(['selectedProducts', carrierId, product], selected);
    }
    case RFP_SUBMITTED_SUCCESS: {
      const data = action.payload;
      let submitted = false;
      let latestSubmitted = 0;
      let selectedCarriers = state.get('selectedCarriers');
      const submissions = state.get('submissions');

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];

        if (item.rfpSubmittedSuccessfully) {
          submitted = true;
          selectedCarriers = selectedCarriers.setIn([item.product.toLowerCase(), item.carrierId, 'lock'], true);
          if (item.submissionDate > latestSubmitted) latestSubmitted = item.submissionDate;
        }
      }

      return state
        .set('submitted', submitted)
        .set('latestSubmitted', latestSubmitted)
        .set('selectedCarriers', selectedCarriers)
        .set('submissions', submissions.concat(fromJS(data)));
    }
    case GET_RFP_STATUS:
      return state
        .set('statusLoaded', false);
    case types.CHANGE_PAGE:
      return state
        .set('page', action.payload.page);
    case GET_RFP_STATUS_SUCCESS: {
      let selectedCarriers = state.get('selectedCarriers');
      let submitted = false;
      let latestSubmitted = 0;
      const { data, rfpcarriers } = action.payload;
      const getCarrier = (carrierId, product) => {
        for (let i = 0; i < rfpcarriers[product].length; i += 1) {
          const item = rfpcarriers[product][i];

          if (item.carrier.carrierId === carrierId) {
            return item.carrier;
          }
        }

        return {};
      };

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];

        if (item.rfpSubmittedSuccessfully) {
          submitted = true;
          selectedCarriers = selectedCarriers.setIn([item.product.toLowerCase(), item.carrierId], { ...getCarrier(item.carrierId, item.product.toLowerCase()), lock: true });
          if (item.submissionDate > latestSubmitted) latestSubmitted = item.submissionDate;
        }
      }

      return state
        .set('submissions', fromJS(data))
        .set('statusLoaded', true)
        .set('selectedCarriers', selectedCarriers)
        .set('latestSubmitted', latestSubmitted)
        .set('submitted', submitted);
    }
    default:
      return state;
  }
}

export default rfpReducer;

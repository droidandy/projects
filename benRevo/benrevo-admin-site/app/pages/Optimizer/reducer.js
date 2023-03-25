import { fromJS } from 'immutable';
import * as types from './constants';

const initialState = fromJS({
  loading: false,
  loaded: false,
  editing: false,
  brokerages: [],
  ga: [],
  errors: [],
  existingProducts: [],
  products: {
    medical: true,
    dental: true,
    vision: true,
  },
  renewals: {
    medical: false,
    dental: false,
    vision: false,
  },
  client: {},
  brokerage: {},
  gaBrokerage: {},
  overrideClient: false,
  newClientName: '',
  selectedBrokerage: {},
  selectedGA: null,
  bccEmail: '',
  addressInfo: {
    address: '',
    city: '',
    state: '',
    zip: '',
  },
});

function OptimizerReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_FIELD: {
      let newState = state;

      if (action.payload.key === 'selectedBrokerage') {
        const addressInfo = initialState.get('addressInfo').toJS();
        const brokerages = state.get('brokerages').toJS();
        let brokerage = {};
        for (let i = 0; i < brokerages.length; i += 1) {
          brokerage = brokerages[i];
          const addressInfoFilled = brokerage.address && brokerage.city && brokerage.state && brokerage.zip;

          if (brokerage.id === action.payload.value) {
            if (!addressInfoFilled) {
              addressInfo.address = brokerage.address || '';
              addressInfo.city = brokerage.city || '';
              addressInfo.state = brokerage.state || '';
              addressInfo.zip = brokerage.zip || '';
            }
            break;
          }
        }

        newState = newState.set('addressInfo', fromJS(addressInfo));
        newState = newState.set(action.payload.key, fromJS(brokerage));
      } else newState = newState.set(action.payload.key, action.payload.value);

      return newState;
    }
    case types.CHANGE_ADDRESS: {
      return state
        .setIn(['addressInfo', action.payload.key], action.payload.value);
    }
    case types.CHANGE_PRODUCT: {
      return state
        .setIn(['products', action.payload.product], action.payload.value);
    }
    case types.CHANGE_RENEWAL: {
      return state
        .setIn(['renewals', action.payload.product], (action.payload.value === 'Yes'));
    }
    case types.CHANGE_EDITING: {
      return state
        .setIn(['editing'], action.payload);
    }
    case types.LOAD_OPTIMIZER: {
      return state
        .set('loading', true);
    }
    case types.LOAD_OPTIMIZER_SUCCESS: {
      return state
        .set('loading', false);
    }
    case types.LOAD_OPTIMIZER_ERROR: {
      return state
        .set('loading', false);
    }

    case types.VALIDATE_OPTIMIZER: {
      return state
        .set('loading', true);
    }
    case types.VALIDATE_OPTIMIZER_SUCCESS: {
      const addressInfo = state.get('addressInfo').toJS();
      const brokerage = action.payload.brokerage;
      const addressInfoFilled = brokerage.address && brokerage.city && brokerage.state && brokerage.zip;

      if (!addressInfoFilled) {
        addressInfo.address = brokerage.address || '';
        addressInfo.city = brokerage.city || '';
        addressInfo.state = brokerage.state || '';
        addressInfo.zip = brokerage.zip || '';
      }

      return state
        .set('loading', false)
        .set('loaded', true)
        .set('overrideClient', false)
        .set('selectedBrokerage', fromJS({}))
        .set('selectedGA', null)
        .set('newClientName', '')
        .set('client', fromJS(action.payload.client || {}))
        .set('brokerage', fromJS(brokerage || {}))
        .set('addressInfo', fromJS(addressInfo))
        .set('existingProducts', fromJS(action.payload.products || []))
        .set('gaBrokerage', fromJS(action.payload.gaBrokerage || {}))
        .set('errors', fromJS(action.payload.errors));
    }
    case types.VALIDATE_OPTIMIZER_ERROR: {
      return state
        .set('loading', false);
    }

    case types.GA_GET: {
      return state
        .setIn(['ga'], fromJS([]));
    }
    case types.GA_GETS_SUCCESS: {
      return state
        .setIn(['ga'], fromJS(action.payload));
    }

    case types.BROKERAGE_GET: {
      return state
        .setIn(['brokerages'], fromJS([]));
    }
    case types.BROKERAGE_GETS_SUCCESS: {
      return state
        .setIn(['brokerages'], fromJS(action.payload));
    }
    case types.UPDATE_BCC: {
      return state
        .setIn(['bccEmail'], action.payload);
    }
    default:
      return state;
  }
}

export default OptimizerReducer;

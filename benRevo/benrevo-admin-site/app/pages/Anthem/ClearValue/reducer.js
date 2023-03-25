import { fromJS } from 'immutable';
import * as types from './constants';

// user empty strings here instead of null, due to form validation
const initialState = fromJS({
  loading: false,
  error: false,
  ratingTiers: 4,
  sicCode: '',
  predominantCounty: '',
  effectiveDate: '',
  averageAge: '',
  medicalPaymentMethod: '%',
  dentalPaymentMethod: '%',
  commission: '',
  dentalCommission: '',
  turnOnMedical1Percent: 'yes',
  calculated: {},
});

function ClearValueReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_CLEAR_VALUE: {
      return state
        .set(action.payload.key, action.payload.value);
    }
    case types.CLEAR_VALUE_CALCULATE: {
      return state
        .set('loading', true);
    }
    case types.CLEAR_VALUE_CALCULATE_SUCCESS: {
      return state
        .set('error', false)
        .set('loading', false)
        .set('calculated', fromJS(action.payload));
    }
    case types.CLEAR_VALUE_CALCULATE_ERROR: {
      return state
        .set('calculated', fromJS({}))
        .set('error', true)
        .set('loading', false);
    }
    default:
      return state;
  }
}

export default ClearValueReducer;

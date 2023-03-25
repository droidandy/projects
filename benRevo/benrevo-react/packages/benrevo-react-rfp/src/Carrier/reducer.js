import 'moment/locale/en-gb';
import { fromJS, Map } from 'immutable';
import {
  SEND_RFP_CLIENT_SUCCESS,
  SEND_RFP,
  SEND_RFP_TO_CARRIER_ERROR,
  RFP_SUBMITTED_SUCCESS,
  SEND_RFP_TO_CARRIER_SUCCESS,
  RESET_RFP_STATE,
  RFP_SUBMIT,
  CHANGE_SELECTED,
  CHECK_CENSUS_TYPE_SUCCESS,
  GET_RFP_STATUS,
  GET_RFP_STATUS_SUCCESS,
  GET_RFP_STATUS_ERROR,
  UPDATE_PLANS_LOADED,
} from '../constants';

export const initialState = fromJS({
  loading: false,
  submitting: false,
  rfpSuccessfullySubmitted: false,
  rfpSubmitDate: null,
  alertMsg: null,
  censusType: Map({}),
  standard: Map({}),
  statusLoaded: false,
  plansLoaded: false,
  clearValue: Map({}),
  qualificationClearValue: Map({}),
  showClearValueBanner: false,
  selected: {
    medical: true,
    dental: true,
    vision: true,
    life: true,
    std: true,
    ltd: true,
  },
});

function carrierReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_SELECTED:
      return state
        .setIn(['selected', action.payload.key], action.payload.value);
    case SEND_RFP:
      return state
        .set('loading', true);
    case RFP_SUBMIT:
      return state
        .set('loading', true)
        .set('submitting', true);
    case RFP_SUBMITTED_SUCCESS: {
      let standard = {};
      let clearValue = {};
      const data = action.payload;

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];

        if (item.type === 'STANDARD') standard = item;
        if (item.type === 'CLEAR_VALUE') clearValue = item;
      }

      return state
        .set('standard', Map(standard))
        .set('clearValue', Map(clearValue))
        .set('loading', false);
    }
    case SEND_RFP_TO_CARRIER_SUCCESS:
      return state
        .set('loading', action.payload.loading);
    case SEND_RFP_CLIENT_SUCCESS:
      return state
        .set('loading', false)
        .set('submitting', false);
    case SEND_RFP_TO_CARRIER_ERROR:
      return state
        .set('loading', false)
        .set('submitting', false)
        .set('rfpSuccessfullySubmitted', false)
        .set('alertMsg', 'Oh No! There was a error saving your RFP. Please refresh and try again.');
    case UPDATE_PLANS_LOADED: {
      return state
        .setIn(['plansLoaded'], action.payload);
    }
    case RESET_RFP_STATE:
      return initialState;
    case GET_RFP_STATUS:
      return state
        .set('statusLoaded', false);
    case GET_RFP_STATUS_SUCCESS: {
      let standard = {};
      let qualificationClearValue = {};
      let showClearValueBanner = false;
      const data = action.payload.data;
      const carrierName = action.payload.carrierName;

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];

        if (item.type === 'STANDARD' && carrierName === item.carrierName) standard = item;
        if (item.type === 'CLEAR_VALUE' && !qualificationClearValue.disqualificationReason) {
          qualificationClearValue = item;
        }
        if (item.type === 'CLEAR_VALUE' && item.rfpSubmittedSuccessfully) {
          showClearValueBanner = true;
        }
      }

      if (action.payload.clearValue) {
        qualificationClearValue = action.payload.clearValue;
        showClearValueBanner = action.payload.clearValue.rfpSubmittedSuccessfully;
      }

      return state
        .set('standard', Map(standard))
        .set('statusLoaded', true)
        .set('showClearValueBanner', showClearValueBanner)
        .set('qualificationClearValue', Map(qualificationClearValue));
    }
    case GET_RFP_STATUS_ERROR:
      return state
        .set('statusLoaded', true);
    case CHECK_CENSUS_TYPE_SUCCESS:
      return state
        .set('censusType', Map(action.payload));
    default:
      return state;
  }
}

export default carrierReducer;

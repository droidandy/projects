import { fromJS } from 'immutable';
import * as types from './constants';

// The initial state of the RFP
const initialState = fromJS({
  carrierEmailList: [],
  loading: false,
});

function AdminBrokerReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CARRIER_EMAILS:
      return state
        .set('loading', true)
        .set('carrierEmailList', fromJS([]));
    case types.UPDATE_CARRIER_EMAILS:
      return state
        .set('loading', true);
    case types.GET_CARRIER_EMAILS_SUCCESS: {
      const configData = action.payload;
      const carrierEmailList = (configData && configData.length && configData[0].data) ? JSON.parse(configData[0].data) : [];
      return state
        .set('loading', false)
        .set('carrierEmailList', fromJS(carrierEmailList));
    }
    case types.CHANGE_APPROVE_CARRIER: {
      const carrierEmailList = state.get('carrierEmailList').toJS();
      if (carrierEmailList[action.payload.carrierIndex]) {
        const newValue = typeof carrierEmailList[action.payload.carrierIndex].approved === 'undefined' ? true : !carrierEmailList[action.payload.carrierIndex].approved;
        return state
          .setIn(['carrierEmailList', action.payload.carrierIndex, 'approved'], fromJS(newValue));
      }
      return state;
    }
    case types.DELETE_EMAIL_FROM_CARRIER: {
      const carrierEmailList = state.get('carrierEmailList').toJS();
      if (carrierEmailList[action.payload.carrierIndex]) {
        carrierEmailList[action.payload.carrierIndex].emails.splice(action.payload.emailIndex, 1);
      }
      return state
        .set('loading', true)
        .set('carrierEmailList', fromJS(carrierEmailList));
    }
    case types.SAVE_EMAILS: {
      const carrierEmailList = state.get('carrierEmailList').toJS();
      if (carrierEmailList[action.payload.carrierIndex]) {
        carrierEmailList[action.payload.carrierIndex].emails = action.payload.emails;
      }
      return state
        .set('loading', true)
        .set('carrierEmailList', fromJS(carrierEmailList));
    }
    default:
      return state;
  }
}

export default AdminBrokerReducer;

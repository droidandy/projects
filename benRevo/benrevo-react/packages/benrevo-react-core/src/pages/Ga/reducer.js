import { fromJS } from 'immutable';
// import moment from 'moment';
import {
  CHANGE_GA_FORM,
  VERIFY_GA_AGENT_EMAIL,
  VERIFY_GA_AGENT_EMAIL_SUCCCESS,
  VERIFY_GA_AGENT_EMAIL_ERROR,
  CREATE_GA_AGENT_ACCOUNT_SUCCESS,
  CREATE_GA_AGENT_ACCOUNT_ERROR,
  CLEAR_FORM,
  FORM,
} from './constants';

export const initialState = fromJS({
  loading: false,
  configLoaded: false,
  formVerified: false,
  formSubmittedSuccessfully: false,
  formSubmittedError: false,
  form: {
    id: 0,
    brokerName: null,
    brokerAddress: null,
    brokerCity: null,
    brokerState: null,
    brokerZip: null,
    brokerEmail: null,
    brokerId: 0,
    gaAddress: null,
    gaCity: null,
    gaId: 0,
    gaState: null,
    gaZip: null,
    gaName: null,
    agentEmail: null,
    agentName: null,
    agentVerified: null,
    brokerPresaleName: null,
    brokerSalesName: null,
  },
});

function gaReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_GA_FORM: {
      const form = state.get('form').toJS();
      const section = action.payload.section;
      form[action.payload.path] = action.payload.value;
      if (form.brokerName
        && form.brokerAddress
        && form.brokerCity
        && form.brokerState
        && form.brokerZip
        && form.brokerEmail

        && ((section !== FORM && form.brokerPresaleName
        && form.brokerSalesName) || section === FORM)) {
        return state
          .setIn(['form', action.payload.path], fromJS(action.payload.value))
          .set('formVerified', fromJS(true));
      }
      return state
        .setIn(['form', action.payload.path], fromJS(action.payload.value))
        .set('formVerified', fromJS(false));
    }
    case VERIFY_GA_AGENT_EMAIL: {
      return state
        .set('loading', true);
    }
    case VERIFY_GA_AGENT_EMAIL_SUCCCESS: {
      return state
        .set('loading', false)
        .setIn(['form', 'agentVerified'], true);
    }
    case VERIFY_GA_AGENT_EMAIL_ERROR: {
      return state
        .set('loading', false)
        .setIn(['form', 'agentVerified'], false);
    }
    case CREATE_GA_AGENT_ACCOUNT_SUCCESS: {
      return state
        .set('formSubmittedSuccessfully', true)
        .set('formSubmittedError', false)
        .set('form', fromJS(action.payload));
    }
    case CREATE_GA_AGENT_ACCOUNT_ERROR: {
      return state
        .set('formSubmittedSuccessfully', false)
        .set('formSubmittedError', true);
    }
    case CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
}

export default gaReducer;

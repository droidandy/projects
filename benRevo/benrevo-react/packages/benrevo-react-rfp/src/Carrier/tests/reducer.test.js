import { fromJS, Map } from 'immutable';
import reducer from '../reducer';
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
} from '../../constants';

describe('carrierReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
      rfpSuccessfullySubmitted: false,
      rfpSubmitDate: null,
      alertMsg: null,
      submitting: false,
      censusType: Map({}),
      standard: Map({}),
      statusLoaded: false,
      clearValue: Map({}),
      qualificationClearValue: Map({}),
      showClearValueBanner: false,
      plansLoaded: false,
      selected: {
        medical: true,
        dental: true,
        vision: true,
        life: true,
        std: true,
        ltd: true,
      },
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_SELECTED', () => {
    const mockAction = { type: CHANGE_SELECTED, payload: { key: 'test1', value: 'test2' } };
    const mockState = state
      .setIn(['selected', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_RFP', () => {
    const mockAction = { type: SEND_RFP };
    const mockState = state.set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RFP_SUBMIT', () => {
    const mockAction = { type: RFP_SUBMIT };
    const mockState = state
      .set('loading', true)
      .set('submitting', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RFP_SUBMITTED_SUCCESS', () => {
    const mockAction = { type: RFP_SUBMITTED_SUCCESS, payload: [{}] };
    const mockState = state
      .set('standard', Map({}))
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_RFP_TO_CARRIER_SUCCESS', () => {
    const mockAction = { type: SEND_RFP_TO_CARRIER_SUCCESS, payload: { loading: true } };
    const mockState = state
      .set('loading', mockAction.payload.loading);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_RFP_CLIENT_SUCCESS', () => {
    const mockAction = { type: SEND_RFP_CLIENT_SUCCESS };
    const mockState = state.set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_RFP_TO_CARRIER_ERROR', () => {
    const mockAction = { type: SEND_RFP_TO_CARRIER_ERROR };
    const mockState = state
      .set('loading', false)
      .set('rfpSuccessfullySubmitted', false)
      .set('alertMsg', 'Oh No! There was a error saving your RFP. Please refresh and try again.');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RESET_RFP_STATE', () => {
    const mockAction = { type: RESET_RFP_STATE };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });

  it('GET_RFP_STATUS', () => {
    const mockAction = { type: GET_RFP_STATUS };
    const mockState = state
      .set('statusLoaded', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_RFP_STATUS_SUCCESS', () => {
    const mockAction = { type: GET_RFP_STATUS_SUCCESS, payload: { data: [] } };
    const mockState = state
      .set('standard', Map({}))
      .set('statusLoaded', true)
      .set('qualificationClearValue', Map({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_RFP_STATUS_ERROR', () => {
    const mockAction = { type: GET_RFP_STATUS_ERROR };
    const mockState = state
      .set('statusLoaded', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHECK_CENSUS_TYPE_SUCCESS', () => {
    const mockAction = { type: CHECK_CENSUS_TYPE_SUCCESS, payload: {} };
    const mockState = state
      .set('censusType', Map(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});


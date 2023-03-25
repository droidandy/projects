import { fromJS, Map } from 'immutable';
import reducer, { initialState } from './../reducerBroker';
import * as types from './../constants';

describe('RfpReducerBroker', () => {
  let state;

  beforeAll(() => {
    state = initialState;
  });

  it('initial state', () => {
    const action = { type: undefined };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('CHANGE_RFP_SENT', () => {
    const action = { type: types.CHANGE_RFP_SENT, payload: {} };
    const mockState = state
      .set('rfpSent', action.payload);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SELECT_CLIENTS_CARRIER', () => {
    const carrier = {
      carrierName: 'anthem',
      carrierId: '123',
    };
    const section = 'medical';
    const products = [];
    const action = { type: types.SELECT_CLIENTS_CARRIER, payload: { carrier, section, products } };
    const selectedCarriers = {
      medical: {
        123: {
          carrierName: 'anthem',
          carrierId: '123',
        },
      },
      dental: {},
      vision: {},
      life: {},
      std: {},
      ltd: {},
    };
    const selected = {};
    const mockState = state
      .set('selectedCarriers', fromJS(selectedCarriers))
      .setIn(['selectedProducts', carrier.carrierId], fromJS(selected));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CARRIER_EMAILS', () => {
    const action = { type: types.GET_CARRIER_EMAILS };
    const mockState = state
      .set('statusLoaded', false)
      .set('submitted', false)
      .set('selectedCarriers', initialState.get('selectedCarriers'))
      .set('submissions', fromJS([]))
      .set('carrierEmailList', fromJS([]));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CARRIER_EMAILS_SUCCESS', () => {
    const configData = '';
    const action = { type: types.GET_CARRIER_EMAILS_SUCCESS, payload: configData };
    const mockState = state
      .set('loading', false)
      .set('carrierEmailList', fromJS([]));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_EMAILS', () => {
    const emails = [];
    const carrier = {
      carrierId: '123',
    };
    const customCarriersEmails = new Map({
      123: fromJS([]),
    });
    const action = { type: types.CHANGE_EMAILS, payload: { carrier, emails } };
    const mockState = state
      .set('customCarriersEmails', customCarriersEmails);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

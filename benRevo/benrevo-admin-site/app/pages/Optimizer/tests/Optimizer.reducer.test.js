import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';

describe('carrierReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
      loaded: false,
      editing: false,
      brokerages: [],
      ga: [],
      errors: [],
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
      existingProducts: [],
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
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_FIELD newClientName', () => {
    const mockAction = { type: types.CHANGE_FIELD, payload: { key: 'newClientName', value: 'test123' } };
    const mockState = state
      .set(mockAction.payload.key, mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_FIELD selectedBrokerage', () => {
    const mockAction = { type: types.CHANGE_FIELD, payload: { key: 'selectedBrokerage', value: 'test123' } };
    const addressInfo = state.get('addressInfo').toJS();
    const brokerages = state.get('brokerages').toJS();
    let brokerage = {};
    for (let i = 0; i < brokerages.length; i += 1) {
      brokerage = brokerages[i];
      const addressInfoFilled = brokerage.address && brokerage.city && brokerage.state && brokerage.zip;

      if (brokerage.id === mockAction.payload.value) {
        if (!addressInfoFilled) {
          addressInfo.address = brokerage.address || '';
          addressInfo.city = brokerage.city || '';
          addressInfo.state = brokerage.state || '';
          addressInfo.zip = brokerage.zip || '';
        }
        break;
      }
    }
    const mockState = state
      .set('addressInfo', fromJS(addressInfo))
      .set(mockAction.payload.key, fromJS(brokerage));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_ADDRESS', () => {
    const mockAction = { type: types.CHANGE_ADDRESS, payload: { key: 'State', value: 'testCalifornia' } };
    const mockState = state
      .setIn(['addressInfo', mockAction.payload.key], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_PRODUCT', () => {
    const mockAction = { type: types.CHANGE_PRODUCT, payload: { key: 'Medical', value: 'testCool' } };
    const mockState = state
      .setIn(['products', mockAction.payload.product], mockAction.payload.value);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_RENEWAL', () => {
    const mockAction = { type: types.CHANGE_RENEWAL, payload: { product: 'medical', value: 'testCool' } };
    const mockState = state
      .setIn(['renewals', mockAction.payload.product], (mockAction.payload.value === 'Yes'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_OPTIMIZER', () => {
    const mockAction = { type: types.LOAD_OPTIMIZER };
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_OPTIMIZER_SUCCESS', () => {
    const mockAction = { type: types.LOAD_OPTIMIZER_SUCCESS };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('LOAD_OPTIMIZER_ERROR', () => {
    const mockAction = { type: types.LOAD_OPTIMIZER_ERROR };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('VALIDATE_OPTIMIZER', () => {
    const mockAction = { type: types.VALIDATE_OPTIMIZER };
    const mockState = state
      .set('loading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('VALIDATE_OPTIMIZER_SUCCESS', () => {
    const brokerage = { address: 'testAdress', city: 'testCity', state: 'testState', zip: '1337' };
    const addressInfo = state.get('addressInfo').toJS();
    const mockAction = { type: types.VALIDATE_OPTIMIZER_SUCCESS, payload: { brokerage, errors: [] } };
    const addressInfoFilled = brokerage.address && brokerage.city && brokerage.state && brokerage.zip;

    if (!addressInfoFilled) {
      addressInfo.address = brokerage.address || '';
      addressInfo.city = brokerage.city || '';
      addressInfo.state = brokerage.state || '';
      addressInfo.zip = brokerage.zip || '';
    }

    const mockState = state
      .set('loading', false)
      .set('loaded', true)
      .set('overrideClient', false)
      .set('selectedBrokerage', fromJS({}))
      .set('selectedGA', null)
      .set('newClientName', '')
      .set('client', fromJS(mockAction.payload.client || {}))
      .set('brokerage', fromJS(brokerage || {}))
      .set('addressInfo', fromJS(addressInfo))
      .set('gaBrokerage', fromJS(mockAction.payload.gaBrokerage || {}))
      .set('errors', fromJS(mockAction.payload.errors));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('VALIDATE_OPTIMIZER_ERROR', () => {
    const mockAction = { type: types.VALIDATE_OPTIMIZER_ERROR };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GA_GET', () => {
    const mockAction = { type: types.GA_GET };
    const mockState = state
      .setIn(['ga'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GA_SUCCESS', () => {
    const mockAction = { type: types.GA_GET, payload: [] };
    const mockState = state
      .setIn(['ga'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
  it('Brokerage_GET', () => {
    const mockAction = { type: types.BROKERAGE_GET };
    const mockState = state
      .setIn(['brokerages'], fromJS([]));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('BROKERAGE_GET_SUCCESS', () => {
    const mockAction = { type: types.BROKERAGE_GET_SUCCESS, payload: [] };
    const mockState = state
      .setIn(['brokerages'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_BCC', () => {
    const mockAction = { type: types.UPDATE_BCC, payload: 'test' };
    const mockState = state
      .setIn(['bccEmail'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});

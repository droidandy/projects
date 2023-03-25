import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../../constants';

describe('appReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      clientValidationStatus: {},
      marketingStatusList: [],
      programs: {
        medical: [],
        dental: [],
        vision: [],
        life: [],
        vol_life: [],
        std: [],
        vol_std: [],
        ltd: [],
        vol_ltd: [],
        clsa: {},
      },
      selectedCarriers: {
        medical: {},
        dental: {},
        vision: {},
        life: {},
        vol_life: {},
        std: {},
        vol_std: {},
        ltd: {},
        vol_ltd: {},
      },
      loadingAttributes: false,
      loadingValidation: false,
      loadingMarketingStatusList: false,
      clsaLoading: false,
      clsaZipError: '',
      clsaModalOpen: false,
      uhcChecked: false,
      uhcQuoted: false,
      clientAttributes: [],
    });
  });

  it('initial state', () => {
    const action = { type: undefined };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('GET_VALIDATE', () => {
    const action = { type: types.GET_VALIDATE };
    const mockState = state
      .set('loadingValidation', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_VALIDATE_SUCCESS', () => {
    const action = { type: types.GET_VALIDATE_SUCCESS, payload: 'test' };
    const mockState = state
      .set('loadingValidation', false)
      .set('clientValidationStatus', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_MARKETING_STATUS_LIST', () => {
    const action = { type: types.GET_MARKETING_STATUS_LIST };
    const selectedCarriers = {
      medical: {},
      dental: {},
      vision: {},
      life: {},
      vol_life: {},
      std: {},
      vol_std: {},
      ltd: {},
      vol_ltd: {},
    };
    const mockState = state
      .set('selectedCarriers', fromJS(selectedCarriers))
      .set('loadingMarketingStatusList', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_MARKETING_STATUS_LIST_SUCCESS', () => {
    const action = { type: types.GET_MARKETING_STATUS_LIST_SUCCESS, payload: [] };
    const selectedCarriers = {
      medical: {},
      dental: {},
      vision: {},
      life: {},
      vol_life: {},
      std: {},
      vol_std: {},
      ltd: {},
      vol_ltd: {},
    };
    const mockState = state
      .set('loadingMarketingStatusList', false)
      .set('selectedCarriers', fromJS(selectedCarriers))
      .set('marketingStatusList', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SELECT_CLIENTS_CARRIER', () => {
    const carrier = {
      carrierId: '1',
      carrierName: 'anthem',
    };
    const section = 'medical';
    const action = { type: types.SELECT_CLIENTS_CARRIER, payload: { carrier, section } };
    const selectedCarriers = {
      medical: {
        1: {
          carrierId: '1',
          carrierName: 'anthem',
        },
      },
      dental: {},
      vision: {},
      life: {},
      vol_life: {},
      std: {},
      vol_std: {},
      ltd: {},
      vol_ltd: {},
    };
    const mockState = state
      .set('selectedCarriers', fromJS(selectedCarriers));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CLSA_QUOTE', () => {
    const action = { type: types.GET_CLSA_QUOTE };
    const mockState = state
      .set('clsaZipError', '')
      .set('clsaLoading', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CLSA_QUOTE_SUCCESS', () => {
    const action = { type: types.GET_CLSA_QUOTE_SUCCESS };
    const mockState = state
      .set('clsaLoading', false)
      .set('clsaModalOpen', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CLSA_QUOTE_ERROR', () => {
    const action = { type: types.GET_CLSA_QUOTE_ERROR };
    const mockState = state
      .set('clsaLoading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ZIP_ERROR', () => {
    const action = { type: types.ZIP_ERROR, payload: 'test' };
    const mockState = state
      .set('clsaZipError', action.payload)
      .set('clsaLoading', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('RESET_ZIP', () => {
    const action = { type: types.RESET_ZIP };
    const mockState = state
      .set('clsaZipError', '');
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CLSA_MODAL_OPEN', () => {
    const action = { type: types.CLSA_MODAL_OPEN };
    const mockState = state
      .set('clsaModalOpen', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CLSA_MODAL_CLOSE', () => {
    const action = { type: types.CLSA_MODAL_CLOSE };
    const mockState = state
      .set('clsaModalOpen', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_UHC', () => {
    const action = { type: types.CHECK_UHC };
    const mockState = state
      .set('uhcChecked', false)
      .set('uhcQuoted', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_UHC_SUCCESS quoted', () => {
    const action = { type: types.CHECK_UHC_SUCCESS, payload: ['test'] };
    const mockState = state
      .set('uhcChecked', true)
      .set('uhcQuoted', true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_UHC_SUCCESS not quoted', () => {
    const action = { type: types.CHECK_UHC_SUCCESS, payload: [] };
    const mockState = state
      .set('uhcChecked', true)
      .set('uhcQuoted', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_UHC_SUCCESS not quoted because of clsa', () => {
    const action = { type: types.CHECK_UHC_SUCCESS, payload: [{ quoteType: 'CLSA_TRUST_PROGRAM' }] };
    const mockState = state
      .set('uhcChecked', true)
      .set('uhcQuoted', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECK_UHC_ERROR', () => {
    const action = { type: types.CHECK_UHC_ERROR };
    const mockState = state
      .set('uhcChecked', true)
      .set('uhcQuoted', false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

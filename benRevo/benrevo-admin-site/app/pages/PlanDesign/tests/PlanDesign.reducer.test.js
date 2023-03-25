import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';
import { getBenefitNames } from '../selectors';

describe('SalesPageReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      viewLoading: false,
      uploadLoading: false,
      loadingTypes: true,
      fileName: '',
      inputYear: (new Date()).getFullYear(),
      changes: {},
      planDesignData: [],
      test: {},
      planType: '',
      planTypeList: [],
      benefitNames: [],
      viewProgress: 0,
    });
  });

  it('CHANGE_YEAR', () => {
    const mockAction = { type: types.CHANGE_YEAR, payload: '2019' };
    const mockState = state
      .set('inputYear', mockAction.payload)
      .set('fileName', '');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CHANGES', () => {
    const mockAction = { type: types.GET_CHANGES };
    const mockState = state
      .set('loading', true)
      .set('fileName', '');
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CHANGES_SUCCESS', () => {
    const mockAction = { type: types.GET_CHANGES_SUCCESS, payload: { data: {}, fileName: 'test' } };
    const mockState = state
      .set('loading', false)
      .set('changes', fromJS(mockAction.payload.data))
      .set('fileName', mockAction.payload.fileName);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_CHANGES_ERROR', () => {
    const mockAction = { type: types.GET_CHANGES_ERROR };
    const mockState = state
      .set('loading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_PLAN', () => {
    const mockAction = { type: types.UPLOAD_PLAN };
    const mockState = state
      .set('uploadLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_PLAN_SUCCESS', () => {
    const mockAction = { type: types.UPLOAD_PLAN_SUCCESS };
    const mockState = state
      .set('uploadLoading', false)
      .set('fileName', '')
      .set('changes', fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPLOAD_PLAN_ERROR', () => {
    const mockAction = { type: types.UPLOAD_PLAN_ERROR };
    const mockState = state
      .set('uploadLoading', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_DESIGN', () => {
    const mockAction = { type: types.GET_PLAN_DESIGN };
    const mockState = state
      .set('viewProgress', 0)
      .set('viewLoading', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_DESIGN_SUCCESS', () => {
    const mockAction = { type: types.GET_PLAN_DESIGN_SUCCESS, payload: [] };
    const benefitNames = getBenefitNames(mockAction.payload);
    const mockState = state
      .set('planDesignData', fromJS(mockAction.payload))
      .set('benefitNames', fromJS(benefitNames))
      .set('viewLoading', state.get('viewLoading'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_DESIGN_ERROR', () => {
    const mockAction = { type: types.GET_PLAN_DESIGN_ERROR };
    const mockState = state
      .set('viewLoading', state.get('viewLoading'));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_TYPES', () => {
    const mockAction = { type: types.GET_PLAN_TYPES };
    const mockState = state
      .set('loadingTypes', true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_TYPES_SUCCESS', () => {
    const mockAction = { type: types.GET_PLAN_TYPES_SUCCESS, payload: ['test'] };
    const mockState = state
      .set('planTypeList', fromJS(mockAction.payload))
      .set('loadingTypes', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_TYPES_ERROR', () => {
    const mockAction = { type: types.GET_PLAN_TYPES_ERROR };
    const mockState = state
      .set('loadingTypes', false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_PLAN_TYPE', () => {
    const mockAction = { type: types.CHANGE_PLAN_TYPE, payload: 'test123' };
    const mockState = state
      .set('planType', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_PROGRESS', () => {
    const mockAction = { type: types.UPDATE_PROGRESS, payload: 1241 };
    const mockState = state
      .set('viewProgress', mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });
});

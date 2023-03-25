import { fromJS, Map } from 'immutable';
import reducer from '../reducer';
import initialRfpMasterState, { createPlan, createLifeStdLTdPlanClass } from '../reducer/state';
import * as types from '../constants';
import * as formTypes from '../formConstants';

describe('rfpReducer', () => {
  const state = initialRfpMasterState;

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });

  it('CHANGE_SHOW_ERRORS', () => {
    const mockAction = { type: types.CHANGE_SHOW_ERRORS, payload: { data: 1 } };
    const mockState = state
      .setIn(['common', 'showErrors'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('createPlan should return the option', () => {
    let plan = fromJS({
      rfpId: null,
      matchCurrent: true, // todo determine if these can be removed and use likeToMatchCurrent instead
      quoteAlt: true, // todo determine if these can be removed and use altQuote instead
      title: 'HMO',
      name: '',
      outOfStateAmount: false,
      outOfStateCurrent: false,
      outOfStateRenewal: false,
      outOfStateEnrollment: false,
      contributionAmount: [],
      outOfStateAmountTiers: [],
      currentRates: [],
      outOfStateCurrentTiers: [],
      renewalRates: [],
      outOfStateRenewalTiers: [],
      contributionEnrollment: [],
      outOfStateContributionEnrollment: [],
      selectedCarrier: {},
      selectedNetwork: {},
    });

    plan = plan
      .set('monthlyBandedPremium', { value: '' })
      .set('oufOfStateMonthlyBandedPremium', { value: '' })
      .set('monthlyBandedPremiumRenewal', { value: '' })
      .set('oufOfStateMonthlyBandedPremiumRenewal', { value: '' });

    plan = plan.merge({
      contributionAmount: plan.get('contributionAmount').push(Map({ value: '' })),
      currentRates: plan.get('currentRates').push(Map({ value: '' })),
      renewalRates: plan.get('renewalRates').push(Map({ value: '' })),
      contributionEnrollment: plan.get('contributionEnrollment').push(Map({ value: '' })),
      outOfStateAmountTiers: plan.get('outOfStateAmountTiers').push(Map({ value: '' })),
      outOfStateCurrentTiers: plan.get('outOfStateCurrentTiers').push(Map({ value: '' })),
      outOfStateRenewalTiers: plan.get('outOfStateRenewalTiers').push(Map({ value: '' })),
      outOfStateContributionEnrollment: plan.get('outOfStateContributionEnrollment').push(Map({ value: '' })),
    });

    expect(createPlan(state, types.RFP_MEDICAL_SECTION)).toEqual(plan);
  });

  it('ADD_CARRIER', () => {
    const mockAction = { type: types.ADD_CARRIER, payload: { type: 'carriers' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([types.RFP_MEDICAL_SECTION, 'carriers'], state.get(types.RFP_MEDICAL_SECTION).get('carriers').push(Map({ title: '', years: '' })));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REMOVE_CARRIER', () => {
    const mockAction = { type: types.REMOVE_CARRIER, payload: { type: 'carriers', index: 0 }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([types.RFP_MEDICAL_SECTION, 'carriers'], state.get(types.RFP_MEDICAL_SECTION).get('carriers').delete(0));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_CARRIER', () => {
    const mockAction = { type: types.UPDATE_CARRIER, payload: { type: 'previousCarriers', index: 0, key: 'title', value: 'test' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    let mockState = state.setIn([mockAction.meta.section, mockAction.payload.type, mockAction.payload.index, mockAction.payload.key], mockAction.payload.value);

    if (!mockAction.payload.value && mockAction.payload.key === 'title') {
      let plans = mockState.get(mockAction.meta.section).get('plans');

      plans.map((item, i) => {
        plans = plans.setIn([i, 'selectedNetwork', 'networkId'], null);
        plans = plans.setIn([i, 'selectedCarrier', 'carrierId'], null);

        return true;
      });
      mockState = mockState.setIn([types.RFP_MEDICAL_SECTION, 'plans'], plans);
    }

    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_TIER', () => {
    const mockAction = { type: types.CHANGE_TIER, payload: 1, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([mockAction.meta.section, 'tier'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('ADD_PLAN', () => {
    const mockAction = { type: types.ADD_PLAN, meta: { section: types.RFP_MEDICAL_SECTION } };
    const section = mockAction.meta.section;
    const item = createPlan(state, section);
    const mockState = state
      .setIn([section, 'plans'], state.get(section).get('plans').push(item))
      .setIn([section, 'optionCount'], state.get(section).get('optionCount') + 1);

    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  describe('REMOVE_PLAN', () => {
    it('should pass without changing the state.', () => {
      const mockAction = { type: types.REMOVE_PLAN, meta: { section: types.RFP_MEDICAL_SECTION } };
      expect(reducer(undefined, mockAction)).toEqual(state);
    });

    it('should remove one option', () => {
      const mockAction = { type: types.REMOVE_PLAN, meta: { section: types.RFP_MEDICAL_SECTION } };
      const section = mockAction.meta.section;
      const item = createPlan(state, section);
      const mockState = state
        .setIn([section, 'plans'], state.get(section).get('plans').push(item))
        .setIn([section, 'optionCount'], state.get(section).get('optionCount') + 1);

      expect(reducer(mockState, mockAction)).toEqual(state.deleteIn([types.RFP_MEDICAL_SECTION, 'rfpPlans', 0]));
    });
  });

  it('UPDATE_PLAN', () => {
    const mockAction = { type: types.UPDATE_PLAN, payload: { index: 0, key: 'name', value: 'test' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([mockAction.meta.section, 'plans', mockAction.payload.index, mockAction.payload.key], mockAction.payload.value);

    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_PLAN_TIER', () => {
    const mockAction = { type: types.UPDATE_PLAN_TIER, payload: { planIndex: 0, type: 'tiers', outOfStateType: 'outOfState', tierIndex: 0, value: '1', outOfState: 'true' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.planIndex, mockAction.payload.type, mockAction.payload.tierIndex, 'value'], mockAction.payload.value)
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.planIndex, 'outOfStateAmount'], mockAction.payload.outOfState)
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.planIndex, 'outOfStateCurrent'], mockAction.payload.outOfState)
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.planIndex, 'outOfStateRenewal'], mockAction.payload.outOfState)
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.planIndex, 'outOfStateEnrollment'], mockAction.payload.outOfState);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_PLAN_BANDED rateType', () => {
    const mockAction = { type: types.UPDATE_PLAN_BANDED, payload: { path: 'rateType', value: '0' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const rateType = (mockAction.payload.value) ? types.RATE_TYPE_BANDED : types.RATE_TYPE_COMPOSITE;
    const mockState = state
      .setIn([mockAction.meta.section, 'rateType'], fromJS(rateType));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('UPDATE_PLAN_BANDED', () => {
    const mockAction = { type: types.UPDATE_PLAN_BANDED, payload: { path: 'monthlyBandedPremium', value: '123', index: 0 }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const plans = state.get(mockAction.meta.section).get('plans').toJS();
    plans[mockAction.payload.index][mockAction.payload.path].value = mockAction.payload.value;
    const mockState = state
      .setIn([mockAction.meta.section, 'plans'], fromJS(plans));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SEND_RFP_TO_CARRIER_SUCCESS', () => {
    const mockAction = { type: types.SEND_RFP_TO_CARRIER_SUCCESS, payload: state };
    const mockState = state
      .setIn(['common', 'rfpCreated'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SET_ERROR', () => {
    const mockAction = { type: formTypes.SET_ERROR, payload: { type: 'test', msg: 'test', meta: null }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([mockAction.meta.section, 'formErrors', mockAction.payload.type], { msg: mockAction.payload.msg, meta: mockAction.payload.meta });
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DELETE_ERROR', () => {
    const mockAction = { type: formTypes.DELETE_ERROR, payload: { type: 'test' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([mockAction.meta.section, 'formErrors', mockAction.payload.type], { msg: 'test', meta: null });
    expect(reducer(mockState, mockAction)).toEqual(state);
  });

  it('SET_VALID', () => {
    const mockAction = { type: formTypes.SET_VALID, payload: true, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state.setIn([mockAction.meta.section, 'complete'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('SET_PAGE_VALID', () => {
    const mockAction = { type: formTypes.SET_PAGE_VALID, payload: { page: 'Test', valid: true }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([mockAction.meta.section, 'valid', mockAction.payload.page], mockAction.payload.valid);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RESET_RFP_STATE', () => {
    const mockAction = { type: types.RESET_RFP_STATE };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });

  it('CHANGE_CURRENT_CARRIER', () => {
    const mockAction = { type: types.CHANGE_CURRENT_CARRIER, payload: { index: 0, carrierId: 123, clearNetwork: false }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.index, 'selectedCarrier'], fromJS({ carrierId: mockAction.payload.carrierId }));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CURRENT_CARRIER clearNetwork', () => {
    const mockAction = { type: types.CHANGE_CURRENT_CARRIER, payload: { index: 0, carrierId: 123, clearNetwork: true }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.index, 'selectedCarrier'], fromJS({ carrierId: mockAction.payload.carrierId }))
      .setIn([mockAction.meta.section, 'networksLoading', mockAction.payload.index], true)
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.index, 'selectedNetwork'], fromJS({}));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CURRENT_NETWORK', () => {
    const mockAction = { type: types.CHANGE_CURRENT_NETWORK, payload: { index: 0, networkId: 123 }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([mockAction.meta.section, 'plans', mockAction.payload.index, 'selectedNetwork'], fromJS({ networkId: mockAction.payload.networkId }));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('RFP_PLANS_GET_ERROR', () => {
    const action = { type: types.RFP_PLANS_GET_ERROR };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('NETWORKS_GET_SUCCESS', () => {
    const action = { type: types.NETWORKS_GET_SUCCESS, payload: { data: [{ networkId: 1, name: 'Test' }], index: 0 }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .deleteIn([action.meta.section, 'networksLoading', action.payload.index])
      .setIn([action.meta.section, 'plans', action.payload.index, 'selectedNetwork'], fromJS({ networkId: 1 }))
      .setIn([action.meta.section, 'rfpPlanNetworks', action.payload.index], fromJS([{ key: 1, value: 1, text: 'Test' }]));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('NETWORKS_GET_ERROR', () => {
    const action = { type: types.NETWORKS_GET_ERROR };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('FETCH_CARRIERS_SUCCEEDED', () => {
    const action = { type: types.FETCH_CARRIERS_SUCCEEDED, payload: { medical: [], dental: [], vision: [], life: [], std: [], ltd: [], index: 0 }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn(['common', 'carriersLoaded'], true)
      .setIn(['medical', 'carrierList'], fromJS(action.payload.medical))
      .setIn(['dental', 'carrierList'], fromJS(action.payload.dental))
      .setIn(['vision', 'carrierList'], fromJS(action.payload.vision))
      .setIn(['life', 'carrierList'], fromJS(action.payload.life))
      .setIn(['std', 'carrierList'], fromJS(action.payload.std))
      .setIn(['ltd', 'carrierList'], fromJS(action.payload.ltd));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('RFP_SUBMITTED_SUCCESS', () => {
    const action = { type: types.RFP_SUBMITTED_SUCCESS };
    const mockState = state
      .setIn(['common', 'requestError'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_LIFE_STD_LTD_PLAN', () => {
    const action = { type: types.CHANGE_LIFE_STD_LTD_PLAN, payload: { type: 'medical', key: 0, value: '123' }, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn([action.meta.section, action.payload.type, action.payload.key], action.payload.value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ADD_LIFE_STD_LTD_PLAN', () => {
    const action = { type: types.ADD_LIFE_STD_LTD_PLAN, payload: { type: 'voluntaryPlan', key: 0, value: '123' }, meta: { section: types.RFP_LIFE_SECTION } };
    let lifeStdLtdPlans = state
      .get(action.meta.section).get(action.payload.type).get('classes');
    lifeStdLtdPlans = lifeStdLtdPlans.push(createLifeStdLTdPlanClass(action.meta.section, action.payload.type));
    const mockState = state
      .setIn([action.meta.section, action.payload.type, 'classes'], lifeStdLtdPlans);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('REMOVE_LIFE_STD_LTD_PLAN', () => {
    const action = { type: types.REMOVE_LIFE_STD_LTD_PLAN, payload: { type: 'voluntaryPlan', key: 0, value: '123' }, meta: { section: types.RFP_LIFE_SECTION } };
    let lifeStdLtdPlans = state
      .get(action.meta.section).get(action.payload.type).get('classes');
    lifeStdLtdPlans = lifeStdLtdPlans.pop();
    const mockState = state
      .setIn([action.meta.section, action.payload.type, 'classes'], lifeStdLtdPlans);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_LIFE_STD_LTD_PLAN_CLASS', () => {
    const action = { type: types.CHANGE_LIFE_STD_LTD_PLAN_CLASS, payload: { type: 'voluntaryPlan', index: 0, key: 0, value: '123' }, meta: { section: types.RFP_LIFE_SECTION } };
    const mockState = state
      .setIn([action.meta.section, action.payload.type, 'classes', action.payload.index, action.payload.key], action.payload.value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_RATE_FIELD', () => {
    const action = { type: types.CHANGE_RATE_FIELD, payload: { type: 'voluntaryPlan', index: 0, key: 0, value: '123' }, meta: { section: types.RFP_LIFE_SECTION } };
    const mockState = state
      .setIn([action.meta.section, action.payload.planType, 'rates', action.payload.rateField], fromJS(action.payload.value));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_RATE_AGE_FIELD to', () => {
    const action = { type: types.CHANGE_RATE_AGE_FIELD, payload: { type: 'voluntaryPlan', index: 0, key: 0, value: '2', field: 'to' }, meta: { section: types.RFP_LIFE_SECTION } };
    const value = action.payload.value;
    const mockState = state
      .setIn([action.meta.section, 'addNewRangeFirstDisabled'], fromJS(false))
      .setIn([action.meta.section, 'addNewRangeLastDisabled'], fromJS(true))
      .setIn([action.meta.section, 'maxFirstIndex'], fromJS(0))
      .setIn([action.meta.section, 'maxLastIndex'], fromJS(9))
      .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages', action.payload.index, action.payload.field], value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_RATE_AGE_FIELD', () => {
    const action = { type: types.CHANGE_RATE_AGE_FIELD, payload: { type: 'voluntaryPlan', index: 0, key: 0, value: '2', field: 'to' }, meta: { section: types.RFP_LIFE_SECTION } };
    const value = action.payload.value;
    const mockState = state
      .setIn([action.meta.section, 'addNewRangeFirstDisabled'], fromJS(false))
      .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages', action.payload.index, action.payload.field], fromJS(value));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_AGES_ROWS_COUNT', () => {
    const action = { type: types.CHANGE_AGES_ROWS_COUNT, payload: { position: 0, index: 0, actionType: 'add', value: '2', field: 'to' }, meta: { section: types.RFP_LIFE_SECTION } };
    const agesArr = state.get(action.meta.section).get('voluntaryPlan').get('rates').get('ages').toJS();
    agesArr.push({ from: NaN, to: null, currentEmp: null, currentEmpTobacco: null, currentSpouse: null, renewalEmp: null, renewalEmpTobacco: null, renewalSpouse: null });
    const mockState = state
      .setIn([action.meta.section, 'addNewRangeFirstDisabled'], fromJS(true))
      .setIn([action.meta.section, 'addNewRangeLastDisabled'], fromJS(true))
      .setIn([action.meta.section, 'maxFirstIndex'], fromJS(0))
      .setIn([action.meta.section, 'maxLastIndex'], fromJS(10))
      .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages'], fromJS(agesArr));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SET_CLIENT_ID', () => {
    const mockAction = { type: types.SET_CLIENT_ID, payload: 123, meta: { section: types.RFP_MEDICAL_SECTION } };
    const mockState = state
      .setIn(['client', 'id'], mockAction.payload);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FETCH_RFP_SUCCEEDED', () => {
    const mockAction = { type: types.FETCH_RFP_SUCCEEDED, payload: state };
    const mockState = state.setIn(['common', 'rfpCreated'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('FETCH_RFP_FAILED', () => {
    const mockAction = { type: types.FETCH_RFP_FAILED };
    expect(reducer(undefined, mockAction)).toEqual(state);
  });
});

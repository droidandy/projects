import { fromJS } from 'immutable';
import configureStore from 'redux-mock-store';

import {
  PLANS_GET,
  PLANS_GET_SUCCESS,
  PLANS_GET_ERROR,
  PLAN_SELECT,
  PLAN_SECOND_SELECT,
  DATA_REFRESHED,
  OPTION_NETWORK_CHANGE_SUCCESS,
  OPTION_NETWORK_ADD_SUCCESS,
  PLAN_SELECT_SUCCESS,
} from '@benrevo/benrevo-react-quote';

import { additionalState } from '../reducer/state';
import * as types from '../constants';
import reducer from '../reducer/match';
import { checkViolation } from '../carrierGuidelineViolation';

describe('teamPageReducer', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  let state;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: additionalState,
    });
    store = mockStore(initialState);
    state = store.getState().get('presentation');
  });

  it('should return the initial state', () => {
    expect(reducer(state, {})).toEqual(state);
  });

  it('CLEAR_ALTERNATIVES', () => {
    const mockAction = { type: types.CLEAR_ALTERNATIVES, meta: { section: 'medical' } };
    const mockState = state
      .setIn([mockAction.meta.section, 'allRx'], fromJS([]))
      .setIn([mockAction.meta.section, 'newPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'allPlans'], fromJS([]))
      .setIn([mockAction.meta.section, 'alternativesPlans'], fromJS({}))
      .setIn([mockAction.meta.section, 'alternativePlans'], fromJS([]))
      .setIn([mockAction.meta.section, 'altPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'currentPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'selectedPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'matchPlan'], fromJS({}));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_SECOND_SELECT select new', () => {
    const section = 'medical';
    const plan = { data: 'testdata' };
    const startState = state.setIn([section, 'altPlan'], fromJS({ rfpQuoteNetworkPlanId: 2 }));
    const mockAction = { type: PLAN_SECOND_SELECT, meta: { section }, payload: { plan, rfpQuoteNetworkPlanId: 1, rfpQuoteOptionNetworkId: 1, actionType: 'select' } };
    const mockState = startState
      .setIn([section, 'altPlan'], fromJS(plan));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_SECOND_SELECT not select new with not null index', () => {
    const section = 'medical';
    const plan = { data: 'testdata' };
    const detailedPlans = [{ secondRfpQuoteNetworkPlanId: 2 }];
    const startState = state
      .setIn([section, 'altPlan'], fromJS({ rfpQuoteNetworkPlanId: 2 }))
      .setIn([section, 'openedOption'], fromJS({ detailedPlans }));
    const mockAction = { type: PLAN_SECOND_SELECT, meta: { section }, payload: { plan, rfpQuoteNetworkPlanId: 2, rfpQuoteOptionNetworkId: 1, actionType: 'unselect' } };
    const mockState = startState
      .setIn([section, 'openedOption', 'detailedPlans', 0, 'secondNewPlan'], fromJS({}))
      .setIn([section, 'altPlan'], fromJS({}));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_SECOND_SELECT not select new with null index', () => {
    const section = 'medical';
    const plan = { data: 'testdata' };
    const detailedPlans = [];
    const startState = state
      .setIn([section, 'altPlan'], fromJS({ rfpQuoteNetworkPlanId: 2 }))
      .setIn([section, 'openedOption'], fromJS({ detailedPlans }));
    const mockAction = { type: PLAN_SECOND_SELECT, meta: { section }, payload: { plan, rfpQuoteNetworkPlanId: 2, rfpQuoteOptionNetworkId: 1, actionType: 'unselect' } };
    const mockState = startState
      .setIn([section, 'altPlan'], fromJS({}));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLANS_GET', () => {
    const mockAction = { type: PLANS_GET, meta: { section: 'medical' } };
    const mockState = state
      .setIn([mockAction.meta.section, 'planTemplate'], fromJS({}))
      .setIn([mockAction.meta.section, 'alternativesLoading'], true)
      .setIn([mockAction.meta.section, 'alternativePlans'], fromJS([]));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLANS_GET_SUCCESS with current plan', () => {
    const alternativesPlans = [{ rfpQuoteNetworkPlanId: 1, selected: false, type: 'primaryPlan' }, { rfpQuoteNetworkPlanId: 4, selected: false, type: 'current' }];
    const alternativesRx = [];
    const alternativePlans = [{ rfpQuoteNetworkPlanId: 1, selected: false, type: 'primaryPlan' }];
    const altPlan = alternativesPlans[0];
    const currentPlan = alternativesPlans[1];
    const selectedPlan = {};
    const matchPlan = {};
    const startState = state
      .setIn(['medical', 'altPlan'], fromJS({}))
      .setIn(['medical', 'newPlan'], fromJS({ rfpQuoteNetworkPlanId: 1 }))
      .setIn(['medical', 'selectedPlan'], fromJS(selectedPlan))
      .setIn(['medical', 'matchPlan'], fromJS(matchPlan));
    const mockAction = { type: PLANS_GET_SUCCESS, meta: { section: 'medical' }, payload: { plans: alternativesPlans } };
    const mockState = startState
      .setIn([mockAction.meta.section, 'allRx'], fromJS(alternativesRx))
      .setIn([mockAction.meta.section, 'allPlans'], fromJS(alternativesPlans))
      .setIn([mockAction.meta.section, 'planTemplate'], fromJS(alternativesPlans[0]))
      .setIn([mockAction.meta.section, 'alternativePlans'], fromJS(alternativePlans))
      .setIn([mockAction.meta.section, 'altPlan'], fromJS(altPlan))
      .setIn([mockAction.meta.section, 'currentPlan'], fromJS(currentPlan))
      .setIn([mockAction.meta.section, 'selectedPlan'], fromJS(selectedPlan))
      .setIn([mockAction.meta.section, 'matchPlan'], fromJS(matchPlan))
      .setIn([mockAction.meta.section, 'matchSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'matchSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedFirstSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedFirstSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedSecondSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selectedSecond)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedSecondSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.secondSelected)) || fromJS({}));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLANS_GET_SUCCESS with no current plan', () => {
    const alternativesPlans = [{ rfpQuoteNetworkPlanId: 1, selected: false, type: 'primaryPlan' }];
    const alternativesRx = [];
    const alternativePlans = [{ rfpQuoteNetworkPlanId: 1, selected: false, type: 'primaryPlan' }];
    const altPlan = alternativesPlans[0];
    const selectedPlan = {};
    const matchPlan = {};
    const startState = state
      .setIn(['medical', 'altPlan'], fromJS({}))
      .setIn(['medical', 'newPlan'], fromJS({ rfpQuoteNetworkPlanId: 1 }))
      .setIn(['medical', 'selectedPlan'], fromJS(selectedPlan))
      .setIn(['medical', 'matchPlan'], fromJS(matchPlan));
    const mockAction = { type: PLANS_GET_SUCCESS, meta: { section: 'medical' }, payload: { plans: alternativesPlans } };
    const mockState = startState
      .setIn([mockAction.meta.section, 'allRx'], fromJS(alternativesRx))
      .setIn([mockAction.meta.section, 'allPlans'], fromJS(alternativesPlans))
      .setIn([mockAction.meta.section, 'planTemplate'], fromJS(alternativesPlans[0]))
      .setIn([mockAction.meta.section, 'alternativePlans'], fromJS(alternativePlans))
      .setIn([mockAction.meta.section, 'altPlan'], fromJS(altPlan))
      .setIn([mockAction.meta.section, 'selectedPlan'], fromJS(selectedPlan))
      .setIn([mockAction.meta.section, 'matchPlan'], fromJS(matchPlan))
      .setIn([mockAction.meta.section, 'matchSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'matchSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedFirstSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedFirstSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.selected)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedSecondSelectedPlan'], fromJS(alternativesPlans.find((item) => item.selectedSecond)) || fromJS({}))
      .setIn([mockAction.meta.section, 'unchangedSecondSelectedRxPlan'], fromJS(alternativesRx.find((item) => item.secondSelected)) || fromJS({}));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLANS_GET_ERROR', () => {
    const mockAction = { type: PLANS_GET_ERROR, meta: { section: 'medical' } };
    const mockState = state
      .setIn([mockAction.meta.section, 'allRx'], fromJS([]))
      .setIn([mockAction.meta.section, 'allPlans'], fromJS([]))
      .setIn([mockAction.meta.section, 'planTemplate'], fromJS({}))
      .setIn([mockAction.meta.section, 'alternativePlans'], fromJS([]))
      .setIn([mockAction.meta.section, 'altPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'currentPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'selectedPlan'], fromJS({}))
      .setIn([mockAction.meta.section, 'matchPlan'], fromJS({}));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_TEMPLATE_GET_SUCCESS', () => {
    const payload = {
      data: { payloadData: 'test' },
      type: 'testType',
    };
    const startState = state.setIn(['medical', 'planTypeTemplates'], fromJS({ testType: 'testData' }));
    const mockAction = { type: types.PLAN_TEMPLATE_GET_SUCCESS, payload, meta: { section: 'medical' } };
    const mockState = startState
      .setIn([mockAction.meta.section, 'planTypeTemplates'], fromJS({ testType: { payloadData: 'test' } }));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_FAVOIRITE_CHANGE favorite', () => {
    const payload = {
      rfpQuoteNetworkPlanId: 1,
      favorite: undefined,
    };
    const section = 'medical';
    const startState = state
      .setIn([section, 'alternativesPlans', 'plans'], fromJS([{ rfpQuoteNetworkPlanId: 1 }]));
    const mockAction = { type: types.PLAN_FAVOIRITE_CHANGE, payload, meta: { section } };
    const mockState = state
      .setIn([section, 'alternativesPlans', 'plans'], fromJS([{ rfpQuoteNetworkPlanId: 1, favorite: true }]))
      .setIn([section, 'allPlans'], fromJS([{ rfpQuoteNetworkPlanId: 1, favorite: true }]));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_FAVOIRITE_CHANGE unfavorite', () => {
    const payload = {
      rfpQuoteNetworkPlanId: 1,
      favorite: true,
    };
    const section = 'medical';
    const startState = state
      .setIn([section, 'alternativesPlans', 'plans'], fromJS([{ rfpQuoteNetworkPlanId: 1 }]));
    const mockAction = { type: types.PLAN_FAVOIRITE_CHANGE, payload, meta: { section } };
    const mockState = state
      .setIn([section, 'alternativesPlans', 'plans'], fromJS([{ rfpQuoteNetworkPlanId: 1, favorite: false }]))
      .setIn([section, 'allPlans'], fromJS([{ rfpQuoteNetworkPlanId: 1, favorite: false }]));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('CLEAR_ALT_PLAN', () => {
    const startState = state.setIn(['medical', 'altPlan'], fromJS({ test: 'data to be cleared' }));
    const mockAction = { type: types.CLEAR_ALT_PLAN, meta: { section: 'medical' } };
    const mockState = state.setIn(['medical', 'altPlan'], fromJS({}));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_EDIT planName', () => {
    const payload = {
      name: 'planName',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.ALTERNATIVE_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'name'], 'testPart');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_EDIT two', () => {
    const payload = {
      name: 'two',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.ALTERNATIVE_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'testPart', parseInt(name, 10), 'testValNameTwo'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_EDIT three', () => {
    const payload = {
      name: 'three',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.ALTERNATIVE_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'testPart', parseInt(name, 10), 'testValNameThree'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_EDIT four', () => {
    const payload = {
      name: 'four',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.ALTERNATIVE_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'testPart', parseInt(name, 10), 'testValNameFour'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_EDIT else', () => {
    const payload = {
      name: 'none',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.ALTERNATIVE_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'testPart', 'none', 'testValName'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('VOL_PLAN_VALUE_EDIT planName', () => {
    const payload = {
      name: 'planName',
      value: 'testVal',
      part: 'testPart',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.VOL_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'name'], 'testPart');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('VOL_PLAN_VALUE_EDIT ages', () => {
    const payload = {
      name: 'notPlanName',
      value: 'testVal',
      part: 'ages',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.VOL_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'rates', 'ages', 'testValName', 'notPlanName'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('VOL_PLAN_VALUE_EDIT classes', () => {
    const payload = {
      name: 'notPlanName',
      value: 'testVal',
      part: 'classes',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.VOL_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'classes', 'notPlanName', 'testValName'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('VOL_PLAN_VALUE_EDIT else', () => {
    const payload = {
      name: 'notPlanName',
      value: 'testVal',
      part: 'else',
      valName: 'testValName',
    };
    const section = 'medical';
    const mockAction = { type: types.VOL_PLAN_VALUE_EDIT, payload, meta: { section } };
    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([section, 'newPlan', 'else', 'testValName'], 'testVal');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_SELECT', () => {
    const mockAction = { type: PLAN_SELECT, meta: { section: 'medical' } };
    const mockState = state
      .setIn([mockAction.meta.section, 'alternativesLoading'], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLANS_SEARCH', () => {
    const plans = [
      { name: 'helloworldcontained' },
      { name: 'notcontained' },
      { name: 'costcontained', cost: [null, { value: 'helloworldcontained' }] },
      { name: 'benefitscontained', benefits: [{ value: 'helloworldcontained' }] },
      { name: 'benefitsInContained', benefits: [{ valueIn: 'helloworldcontained' }] },
      { name: 'benefitsOutContained', benefits: [{ valueOut: 'helloworldcontained' }] },
      { name: 'benefitsNotContained', benefits: [{ value: 'notcontained' }] },
    ];
    const startState = state
      .setIn(['medical', 'alternativesPlans'], fromJS({ plans }));
    const mockAction = { type: types.PLANS_SEARCH, payload: { searchString: 'helloworld' }, meta: { section: 'medical' } };
    const mockState = startState
      .setIn(['medical', 'allPlans'], fromJS([
        { name: 'helloworldcontained' },
        { name: 'costcontained', cost: [null, { value: 'helloworldcontained' }] },
        { name: 'benefitscontained', benefits: [{ value: 'helloworldcontained' }] },
        { name: 'benefitsInContained', benefits: [{ valueIn: 'helloworldcontained' }] },
        { name: 'benefitsOutContained', benefits: [{ valueOut: 'helloworldcontained' }] },
      ]));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('VIOLATION_MODAL_CLOSE', () => {
    const startState = state.setIn(['medical', 'violationModalText', 1], fromJS({ status: true }));
    const mockAction = { type: types.VIOLATION_MODAL_CLOSE, payload: 1, meta: { section: 'medical' } };
    const mockState = state.setIn(['medical', 'violationModalText', 1], fromJS({ status: false }));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('SET_PLAN_VIOLATION', () => {
    const mockAction = { type: types.SET_PLAN_VIOLATION, payload: { optionId: 1, violationStatus: true }, meta: { section: 'medical' } };
    const mockState = state.setIn(['medical', 'violationNotification', 1], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_ALT_PLANS_FOR_DROPDOWN', () => {
    const mockAction = { type: types.GET_ALT_PLANS_FOR_DROPDOWN, meta: { section: 'medical' } };
    const mockState = state.setIn(['medical', 'plansForDropDownLoading'], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_ALT_PLANS_FOR_DROPDOWN_SUCCESS', () => {
    const data = [{ rfpQuoteNetworkId: 1, plans: 'test1' }, { rfpQuoteNetworkId: 2, plans: 'test2' }];
    const meta = { section: 'medical' };
    const mockAction = { type: types.GET_ALT_PLANS_FOR_DROPDOWN_SUCCESS, payload: { data }, meta };
    const mockState = state
      .setIn(['medical', 'plansForDropDownLoading'], false)
      .setIn(['medical', 'plansForDropDown'], fromJS({ 1: 'test1', 2: 'test2' }));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_ALT_PLANS_FOR_DROPDOWN_ERROR', () => {
    const mockAction = { type: types.GET_ALT_PLANS_FOR_DROPDOWN_ERROR, payload: { rfpQuoteOptionNetworkId: 1 }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'plansForDropDownLoading'], false)
      .setIn(['medical', 'plansForDropDown', 1], fromJS([]));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_LABEL_CHANGE', () => {
    const mockAction = { type: types.PLAN_LABEL_CHANGE, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'optionNameLoading'], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_LABEL_CHANGE_ERROR', () => {
    const startState = state.setIn(['medical', 'optionNameLoading'], true);
    const mockAction = { type: types.PLAN_LABEL_CHANGE_ERROR, meta: { section: 'medical' } };
    const mockState = startState
      .setIn(['medical', 'optionNameLoading'], false);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_LABEL_CHANGE_SUCCESS displayName', () => {
    const startState = state.setIn(['medical', 'openedOption'], fromJS({ displayName: 'exist' }));
    const mockAction = { type: types.PLAN_LABEL_CHANGE_SUCCESS, meta: { section: 'medical' }, payload: { displayName: 'Test Display Name' } };
    const mockState = startState
      .setIn(['medical', 'openedOption'], fromJS({ displayName: 'Test Display Name' }))
      .setIn(['medical', 'optionNameLoading'], false);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_LABEL_CHANGE_SUCCESS detailedPlan', () => {
    const startState = state.setIn(['medical', 'openedOption'], fromJS({ detailedPlan: { displayName: 'replaceMe' } }));
    const mockAction = { type: types.PLAN_LABEL_CHANGE_SUCCESS, meta: { section: 'medical' }, payload: { displayName: 'Test Display Name' } };
    const mockState = startState
      .setIn(['medical', 'openedOption'], fromJS({ detailedPlan: { displayName: 'Test Display Name' } }))
      .setIn(['medical', 'optionNameLoading'], false);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_SELECT_BROKER openedOption', () => {
    const startState = state
      .setIn(['medical', 'openedOption'], fromJS({ id: 'bam', detailedPlans: [{ displayName: 'exists' }] }))
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const violationMessage = checkViolation('testName', { detailedPlans: [{ displayName: 'exists' }] });
    const violationStatus = violationMessage.status;
    const mockAction = { type: types.PLAN_SELECT_BROKER, meta: { section: 'medical' }, payload: { index: 0, rfpQuoteNetworkPlanId: 1 } };
    const mockState = startState
      .setIn(['medical', 'violationModalText', 'bam'], fromJS(violationMessage))
      .setIn(['medical', 'violationNotification', 'bam'], violationStatus)
      .setIn(['medical', 'alternativesLoading'], false)
      .setIn(['medical', 'openedOption', 'detailedPlans', 0], fromJS({ displayName: 'exists', rfpQuoteNetworkPlanId: 1 }));
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('PLAN_SELECT_BROKER no openedOption', () => {
    const startState = state
      .setIn(['medical', 'openedOption'], fromJS({ id: 'bam', detailedPlans: [] }))
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const mockAction = { type: types.PLAN_SELECT_BROKER, meta: { section: 'medical' }, payload: { index: 0, rfpQuoteNetworkPlanId: 1 } };
    expect(reducer(startState, mockAction)).toEqual(startState);
  });

  it('DATA_REFRESHED', () => {
    const openedOption = { id: 'bam', detailedPlans: [{ displayName: 'exists' }] };
    const startState = state
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const violationMessage = checkViolation('testName', { detailedPlans: [{ displayName: 'exists' }] });
    const violationStatus = violationMessage.status;
    const mockAction = { type: DATA_REFRESHED, meta: { section: 'medical' }, payload: { data: openedOption } };
    const mockState = startState
      .setIn(['medical', 'violationModalText', openedOption.id], fromJS(violationMessage))
      .setIn(['medical', 'violationNotification', openedOption.id], violationStatus);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('DATA_REFRESHED no openedOption', () => {
    const openedOption = undefined;
    const startState = state
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const mockAction = { type: DATA_REFRESHED, meta: { section: 'medical' }, payload: { data: openedOption } };
    const mockState = startState;
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('OPTION_NETWORK_CHANGE_SUCCESS', () => {
    const openedOption = { id: 'bam', detailedPlans: [{ displayName: 'exists' }] };
    const startState = state
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const violationMessage = checkViolation('testName', { detailedPlans: [{ displayName: 'exists' }] });
    const violationStatus = violationMessage.status;
    const mockAction = { type: OPTION_NETWORK_CHANGE_SUCCESS, meta: { section: 'medical' }, payload: { data: openedOption } };
    const mockState = startState
      .setIn(['medical', 'violationModalText', openedOption.id], fromJS(violationMessage))
      .setIn(['medical', 'violationNotification', openedOption.id], violationStatus);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('OPTION_NETWORK_ADD_SUCCESS', () => {
    const openedOption = { id: 'bam', detailedPlans: [{ displayName: 'exists' }] };
    const startState = state
      .setIn(['medical', 'page'], fromJS({ carrier: { carrier: { name: 'testName' } } }));
    const violationMessage = checkViolation('testName', { detailedPlans: [{ displayName: 'exists' }] });
    const violationStatus = violationMessage.status;
    const mockAction = { type: OPTION_NETWORK_ADD_SUCCESS, meta: { section: 'medical' }, payload: { data: openedOption } };
    const mockState = startState
      .setIn(['medical', 'violationModalText', openedOption.id], fromJS(violationMessage))
      .setIn(['medical', 'violationNotification', openedOption.id], violationStatus);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_SECTION', () => {
    const mockAction = { type: types.CHANGE_SELECTED_SECTION, payload: { testData: 'test123' } };
    const mockState = state
      .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS([]))
      .setIn(['comparePlans', 'clientPlanSelected'], null)
      .setIn(['comparePlans', 'sectionSelected'], fromJS(mockAction.payload));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_LIST_FOR_FILTER_COMPARE', () => {
    const mockAction = { type: types.GET_PLANS_LIST_FOR_FILTER_COMPARE };
    const mockState = state
      .setIn(['comparePlans', 'allOptionsToCompare'], fromJS([]))
      .setIn(['comparePlans', 'allPlansToCompare'], fromJS([]))
      .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS([]))
      .setIn(['comparePlans', 'clientPlanSelected'], null)
      .setIn(['comparePlans', 'sectionSelected'], fromJS('MEDICAL'));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_LIST_FOR_FILTER_COMPARE_SUCCESS', () => {
    const mockAction = { type: types.GET_PLANS_LIST_FOR_FILTER_COMPARE_SUCCESS, payload: { data: { testData: 'test123' } } };
    const mockState = state
      .setIn(['comparePlans', 'clientPlans'], fromJS({ testData: 'test123' }))
      .setIn(['comparePlans', 'clientPlansLoading'], false);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_CLIENT_PLAN_ID', () => {
    const mockAction = { type: types.CHANGE_SELECTED_CLIENT_PLAN_ID, payload: { test: '123' } };
    const mockState = state
      .setIn(['comparePlans', 'planFilterChanged'], true)
      .setIn(['comparePlans', 'clientPlanSelected'], fromJS(mockAction.payload));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_CARRIERS', () => {
    const mockAction = { type: types.CHANGE_SELECTED_CARRIERS, payload: { test: '123' } };
    const mockState = state
      .setIn(['comparePlans', 'planFilterChanged'], true)
      .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS(mockAction.payload));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_FOR_COMPARE', () => {
    const mockAction = { type: types.GET_PLANS_FOR_COMPARE, payload: { data: { testData: 'test123' } } };
    const startState = state.setIn(['comparePlans', 'clientPlanSelected'], true);
    const mockState = startState
      .setIn(['comparePlans', 'clientPlansLoading'], true);
    expect(reducer(startState, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_FOR_COMPARE_SUCCESS', () => {
    const data = [
      { plans: [{ networkPlan: '123' }], name: 'test' },
    ];
    const mockAction = { type: types.GET_PLANS_FOR_COMPARE_SUCCESS, payload: { data }, meta: { product: 'medical' } };
    const mockState = state
      .setIn(['comparePlans', 'planFilterChanged'], false)
      .setIn(['comparePlans', 'clientPlansLoading'], false)
      .setIn(['comparePlans', 'allOptionsToCompare'], fromJS([{ name: 'test' }]))
      .setIn(['comparePlans', 'allPlansToCompare'], fromJS(['123']));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_FOR_COMPARE_ERROR', () => {
    const mockAction = { type: types.GET_PLANS_FOR_COMPARE_ERROR };
    const mockState = state.setIn(['comparePlans', 'clientPlansLoading'], false);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLANS_FOR_SELECT_BENEFITS_SUCCESS', () => {
    const mockAction = { type: types.GET_PLANS_FOR_SELECT_BENEFITS_SUCCESS, payload: { data: ['test'] } };
    const mockState = state.setIn(['plansForImportBenefits'], fromJS(['test']));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_RX_PLANS_FOR_SELECT_BENEFITS_SUCCESS', () => {
    const mockAction = { type: types.GET_RX_PLANS_FOR_SELECT_BENEFITS_SUCCESS, payload: { data: ['test'] } };
    const mockState = state.setIn(['rxPlansForImportBenefits'], fromJS(['test']));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_FOR_BENEFITS', () => {
    const mockAction = { type: types.GET_PLAN_FOR_BENEFITS, payload: { pnnId: 123 }, meta: { section: 'medical' } };
    const mockState = state.setIn(['benefitsLoading'], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_FOR_BENEFITS addPlan', () => {
    const mockAction = { type: types.GET_PLAN_FOR_BENEFITS, payload: { pnnId: 'addPlan' }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['benefitsLoading'], false)
      .setIn(['medical', 'newPlan', 'pnnId'], 'addPlan');
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_FOR_BENEFITS_SUCCESS no rx', () => {
    const data = { pnnId: '123', name: 'test', benefits: { testData: '123' } };
    const mockAction = { type: types.GET_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['benefitsLoading'], false)
      .setIn(['medical', 'newPlan', 'pnnId'], data.pnnId)
      .setIn(['medical', 'newPlan', 'nameByNetwork'], data.name)
      .setIn(['medical', 'newPlan', 'benefits'], fromJS(data.benefits));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_FOR_BENEFITS_SUCCESS with rx', () => {
    const data = { pnnId: '123', name: 'test', benefits: { testData: '123' }, rx: ['1', '2', '3'] };
    const mockAction = { type: types.GET_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['benefitsLoading'], false)
      .setIn(['medical', 'newPlan', 'pnnId'], data.pnnId)
      .setIn(['medical', 'newPlan', 'nameByNetwork'], data.name)
      .setIn(['medical', 'newPlan', 'benefits'], fromJS(data.benefits))
      .setIn(['medical', 'newPlan', 'rx'], fromJS(data.rx));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_RX_PLAN_FOR_BENEFITS_SUCCESS', () => {
    const data = { pnnId: '123', rx: ['1', '2', '3'] };
    const mockAction = { type: types.GET_RX_PLAN_FOR_BENEFITS_SUCCESS, payload: { data }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['benefitsLoading'], false)
      .setIn(['medical', 'newPlan', 'pnnRxId'], data.pnnId)
      .setIn(['medical', 'newPlan', 'rx'], fromJS(data.rx));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_PLAN_FOR_BENEFITS_ERROR', () => {
    const mockAction = { type: types.GET_PLAN_FOR_BENEFITS_ERROR, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'newPlan'], fromJS({}))
      .setIn(['benefitsLoading'], false);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('PLAN_SELECT_SUCCESS', () => {
    const mockAction = { type: PLAN_SELECT_SUCCESS, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'altPlan'], fromJS({}))
      .setIn(['medical', 'alternativesLoading'], true);
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_CARRIERS_SUCCESS', () => {
    const data = [{ carrier: { carrierId: 'testId' } }];
    const mockAction = { type: types.GET_CARRIERS_SUCCESS, payload: data, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['comparePlans', 'clientPlanCarriersSelected'], fromJS(['testId']));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('GET_CARRIERS_SUCCESS nonmedical', () => {
    const data = [{ carrier: { carrierId: 'testId' } }];
    const mockAction = { type: types.GET_CARRIERS_SUCCESS, payload: data, meta: { section: 'dental' } };
    const mockState = state;
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('CHANGE_ACCORDION_INDEX', () => {
    const mockAction = { type: types.CHANGE_ACCORDION_INDEX, payload: { accordionActiveIndex: { index: 1 } } };
    const mockState = state
      .setIn(['accordionActiveIndex'], fromJS({ index: 1 }));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_RX', () => {
    const mockAction = { type: types.CHANGE_SELECTED_RX, payload: { plan: { data: 'test' } }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'matchSelectedRxPlan'], fromJS({ data: 'test' }));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });

  it('CHANGE_SELECTED_PLAN', () => {
    const mockAction = { type: types.CHANGE_SELECTED_PLAN, payload: { plan: { data: 'test' } }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['medical', 'matchSelectedPlan'], fromJS({ data: 'test' }));
    expect(reducer(state, mockAction)).toEqual(mockState);
  });
});

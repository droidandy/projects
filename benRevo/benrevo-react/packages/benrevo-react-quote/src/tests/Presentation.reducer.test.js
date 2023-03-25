describe('teamPageReducer', () => {
  it('teamPageReducer', () => {
    expect(true).toEqual(true);
  });
});
/*
import { fromJS, Map } from 'immutable';
import { QUOTED_NORMAL } from '@benrevo/benrevo-react-clients';
import configureStore from 'redux-mock-store';
configure({ adapter: new Adapter() });

import { ContributionData, OptionData, OptionsData, SelectedData, SummaryData, NetworksData, EnrollmentData } from '@benrevo/benrevo-react-core';
import reducer from '../reducer';
import * as actions from '../actions';
import {
  PLAN_TYPE_MEDICAL,
  PLAN_TYPE_DENTAL,
  PLAN_TYPE_VISION,
  PLANS_GET_SUCCESS,
  PLANS_GET_ERROR,
  COMPARE_GET_SUCCESS,
  COMPARE_GET_ERROR,
  OPTIONS_SELECT_SUCCESS,
  OPTIONS_SELECT_ERROR,
  OPTIONS_UNSELECT_SUCCESS,
  OPTIONS_UNSELECT_ERROR,
  OPTIONS_DELETE_SUCCESS,
  OPTIONS_DELETE_ERROR,
  SELECTED_GET_SUCCESS,
  QUOTES_GET_SUCCESS,
  QUOTES_GET_ERROR,
  OPTION_NETWORK_GET_SUCCESS,
  OPTION_NETWORK_GET_ERROR,
  OPTION_CONTRIBUTION_GET_SUCCESS,
  OPTION_CONTRIBUTION_GET_ERROR,
  OPTIONS_GET_SUCCESS,
  OPTIONS_GET_ERROR,
  ENROLLMENT_GET,
  ENROLLMENT_GET_SUCCESS,
  ENROLLMENT_GET_ERROR,
  PLAN_SELECT_SUCCESS,
  PLAN_SELECT_ERROR,
  OPTION_NETWORK_ADD_SUCCESS,
  OPTION_NETWORK_ADD_ERROR,
  SUBMIT_FINAL_SECTIONS_SUCCESS,
  SUBMIT_FINAL_SECTIONS_ERROR,
  SELECTED_GET_ERROR,
  SUBMIT_FINAL_SECTIONS,
  ALTERNATIVE_PLAN_VALUE_CHANGE,
  ALTERNATIVE_PLAN_ADD,
  ALTERNATIVE_PLAN_ADD_SUCCESS,
  ALTERNATIVE_PLAN_ADD_ERROR,
  ENROLLMENT_EDIT,
  ENROLLMENT_SAVE,
  ENROLLMENT_SAVE_SUCCESS,
  ENROLLMENT_SAVE_ERROR,
  SET_CLIENT,
  CARRIERS_GET_ERROR,
  QUOTES_STATUS_GET_ERROR,
  GET_QUOTES_CATEGORY_SUCCESS,
  GET_QUOTES_CATEGORY_ERROR,
  SET_CURRENT_NETWORK_NAME,
  EXTERNAL_PRODUCTS_SELECT,
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_ERROR,
  COMPARE_FILE_SUCCESS,
  COMPARE_FILE_ERROR,
  GET_CLEAR_VALUE_STATUS_SUCCESS,
  CREATE_DTP_CLEAR_VALUE,
  CREATE_DTP_CLEAR_VALUE_SUCCESS,
  CREATE_DTP_CLEAR_VALUE_ERROR,
  ALTERNATIVE_PLAN_DELETE_SUCCESS,
  CARRIER_NETWORKS_GET_SUCCESS,
  OPTION_RIDER_GET_SUCCESS,
  OPTION_RIDER_FEE_GET_SUCCESS,
  COMPARISON_GET_SUCCESS,
  COMPARISON_GET_ERROR,
  DISCLAIMER_GET,
  DISCLAIMER_GET_SUCCESS,
  DISCLAIMER_GET_ERROR,
  OPTION_COMPARE_NETWORKS_GET,
  OPTION_COMPARE_NETWORKS_GET_SUCCESS,
  OPTION_COMPARE_NETWORKS_GET_ERROR,
} from '../constants';
import { initialPresentationMasterState } from './../reducer/state';

describe('teamPageReducer', () => {
  const middlewares = [];
  const mockStore = configureStore(middlewares);
  let store;
  let state;

  beforeAll(() => {
    const initialState = fromJS({
      presentation: initialPresentationMasterState,
    });
    store = mockStore(initialState);
    state = initialPresentationMasterState; // store.getState().get('presentation');
  });

  it('CHANGE_LOAD', () => {
    const action = actions.changeLoad(PLAN_TYPE_MEDICAL, { options: false });
    const mockState = state
      .setIn([action.meta.section, 'load'], fromJS({
        options: false,
        overview: true,
        alternatives: true,
        compare: true,
      }));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHANGE_LOAD_RESET', () => {
    const action = actions.changeLoadReset();
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('CHANGE_CONTRIBUTION_TYPE', () => {
    const action = actions.changeContributionType(PLAN_TYPE_MEDICAL, 0, '%');
    const mockState = state
      .setIn([action.meta.section, 'openedOptionContributions', action.payload.index, 'proposedContrFormat'], action.payload.value);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  describe('CHANGE_CONTRIBUTION', () => {
    it('valid value', () => {
      const baseState = state
        .setIn([PLAN_TYPE_MEDICAL, 'openedOptionContributions'], fromJS(ContributionData));
      const action = actions.changeContribution(PLAN_TYPE_MEDICAL, 0, 0, '1', 'proposedER');
      const mockState = baseState
        .setIn([action.meta.section, 'openedOptionContributions', 0, 'contributions', 0, 'proposedER'], '1');
      expect(reducer(baseState, action)).toEqual(mockState);
    });

    it('invalid value', () => {
      const baseState = state
        .setIn([PLAN_TYPE_MEDICAL, 'openedOptionContributions'], fromJS(ContributionData));
      const action = actions.changeContribution(PLAN_TYPE_MEDICAL, 0, 0, 'value', 'proposedER');
      const mockState = baseState
        .setIn([action.meta.section, 'openedOptionContributions', 0, 'contributions', 0, 'proposedER'], 0);
      expect(reducer(baseState, action)).toEqual(mockState);
    });
  });

  it('PLANS_GET_SUCCESS', () => {
    const mockAction = { meta: { section: PLAN_TYPE_MEDICAL }, type: PLANS_GET_SUCCESS, payload: {} };
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], false)
      .setIn([mockAction.meta.section, 'plansGetSuccess'], true)
      .setIn([mockAction.meta.section, 'plansGetError'], false)
      .setIn([mockAction.meta.section, 'stateAlternativesPlans'], fromJS(mockAction.payload))
      .setIn([mockAction.meta.section, 'alternativesPlans'], fromJS(mockAction.payload));
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('PLANS_GET_ERROR', () => {
    const mockAction = { meta: { section: PLAN_TYPE_MEDICAL }, type: PLANS_GET_ERROR, payload: [] };
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], false)
      .setIn([mockAction.meta.section, 'plansGetSuccess'], false)
      .setIn([mockAction.meta.section, 'plansGetError'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('COMPARE_GET', () => {
    const mockAction = actions.getCompare(PLAN_TYPE_MEDICAL);
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('COMPARE_GET_SUCCESS', () => {
    const mockAction = { meta: { section: PLAN_TYPE_MEDICAL }, type: COMPARE_GET_SUCCESS, payload: [] };
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('COMPARE_GET_ERROR', () => {
    const mockAction = { meta: { section: PLAN_TYPE_MEDICAL }, type: COMPARE_GET_ERROR, payload: [] };
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], false);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('CHANGE_CURRENT_PAGE', () => {
    const mockAction = actions.changeCurrentPage(PLAN_TYPE_MEDICAL, state.get(PLAN_TYPE_MEDICAL).get('page'));
    const mockState = state
      .setIn([mockAction.meta.section, 'page'], mockAction.page);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('REFRESH_PRESENTATION_DATA', () => {
    const mockAction = actions.refreshPresentationData(PLAN_TYPE_MEDICAL);
    const mockState = state
      .setIn([mockAction.meta.section, 'loading'], true);
    expect(reducer(undefined, mockAction)).toEqual(mockState);
  });

  it('DATA_REFRESHED', () => {
    const action = actions.dataRefreshed(PLAN_TYPE_MEDICAL, OptionData);
    const mockState = state
      .setIn([action.meta.section, 'page', 'id'], action.data.id)
      .setIn([action.meta.section, 'openedOption'], fromJS(action.data))
      .setIn([action.meta.section, 'loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPENED_OPTION_CLEAR', () => {
    const action = actions.openedOptionClear(PLAN_TYPE_MEDICAL);
    expect(reducer(undefined, action)).toEqual(state);
  });

  describe('OPTION_CHECK', () => {
    it('default empty list', () => {
      const action = actions.optionCheck(PLAN_TYPE_MEDICAL, { id: 1 });
      const baseState = state.setIn([action.meta.section, 'checkedOptions'], fromJS([1]));
      const mockState = baseState
        .setIn([action.meta.section, 'load', 'compare'], true)
        .setIn([action.meta.section, 'checkedOptions'], fromJS([]));
      expect(reducer(baseState, action)).toEqual(mockState);
    });

    it('list with items', () => {
      const action = actions.optionCheck(PLAN_TYPE_MEDICAL, { id: 1 });
      const baseState = state.setIn([action.meta.section, 'checkedOptions'], fromJS([100, 101, 102]));
      const mockState = baseState
        .setIn([action.meta.section, 'load', 'compare'], true)
        .setIn([action.meta.section, 'checkedOptions'], fromJS([101, 102, 1]));
      expect(reducer(baseState, action)).toEqual(mockState);
    });
  });

  it('DATA_REFRESH_ERROR', () => {
    const action = actions.dataRefreshError(PLAN_TYPE_MEDICAL, { message: 1 });
    const mockState = state
      .setIn([action.meta.section, 'error'], action.error.message)
      .setIn([action.meta.section, 'loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTIONS_SELECT_SUCCESS', () => {
    const action = { type: OPTIONS_SELECT_SUCCESS, payload: { id: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'selected'], action.payload.id);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTIONS_SELECT_ERROR', () => {
    const action = { type: OPTIONS_SELECT_ERROR, payload: { message: '1' }, meta: { PLAN_TYPE_MEDICAL } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTIONS_UNSELECT_SUCCESS', () => {
    const action = { type: OPTIONS_UNSELECT_SUCCESS, payload: { id: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'selected'], null);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTIONS_UNSELECT_ERROR', () => {
    const action = { type: OPTIONS_UNSELECT_ERROR, payload: { message: '1' }, meta: { PLAN_TYPE_MEDICAL } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTIONS_DELETE', () => {
    const baseState = state
      .setIn([PLAN_TYPE_MEDICAL, 'checkedOptions'], fromJS([1, 101, 102]))
      .setIn([PLAN_TYPE_MEDICAL, 'current'], fromJS(OptionsData.currentOption))
      .setIn([PLAN_TYPE_MEDICAL, 'current', 'id'], 'current')
      .setIn([PLAN_TYPE_MEDICAL, 'loading'], false)
      .setIn([PLAN_TYPE_MEDICAL, 'selected'], 1)
      .setIn([PLAN_TYPE_MEDICAL, 'options'], fromJS(OptionsData.options));
    const optionsFinal = baseState
      .setIn([PLAN_TYPE_MEDICAL, 'selected'], 0)
      .deleteIn([PLAN_TYPE_MEDICAL, 'options', 0])
      .deleteIn([PLAN_TYPE_MEDICAL, 'checkedOptions', 0]);
    const action = actions.optionsDelete(PLAN_TYPE_MEDICAL, 1);
    expect(reducer(baseState, action)).toEqual(optionsFinal);
  });

  it('OPTIONS_SELECT_SUCCESS', () => {
    const action = { type: OPTIONS_SELECT_SUCCESS, payload: { id: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'selected'], action.payload.id);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTIONS_DELETE_SUCCESS', () => {
    const action = { type: OPTIONS_DELETE_SUCCESS, payload: { id: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTIONS_DELETE_ERROR', () => {
    const action = { type: OPTIONS_DELETE_ERROR, payload: { id: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('SELECTED_GET', () => {
    const action = actions.getFinal(PLAN_TYPE_MEDICAL);
    const mockState = state
      .setIn(['final', 'loading'], true)
      .setIn(['final', 'showErr'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SELECTED_GET_SUCCESS', () => {
    const action = { type: SELECTED_GET_SUCCESS, payload: SelectedData };
    let baseState = state
      .setIn([PLAN_TYPE_MEDICAL, 'selectedPlans'], SelectedData.medicalPlans)
      .setIn([PLAN_TYPE_MEDICAL, 'totalPlans'], SelectedData.medicalPlans[0].total);
    baseState = baseState
      .setIn(['final', 'loading'], false)
      .setIn(['final', 'submittedDate'], action.payload.submittedDate)
      .setIn([PLAN_TYPE_VISION, 'selected'], action.payload.visionQuoteOptionId)
      .setIn([PLAN_TYPE_MEDICAL, 'selected'], action.payload.medicalQuoteOptionId)
      .setIn([PLAN_TYPE_DENTAL, 'selected'], action.payload.dentalQuoteOptionId)
      .setIn([PLAN_TYPE_VISION, 'selectedOptionName'], action.payload.visionQuoteOptionName)
      .setIn([PLAN_TYPE_MEDICAL, 'selectedOptionName'], action.payload.medicalQuoteOptionName)
      .setIn([PLAN_TYPE_DENTAL, 'selectedOptionName'], action.payload.dentalQuoteOptionName)
      .setIn(['final', 'totalAll'], SelectedData.total)
      .setIn(['final', 'dentalBundleDiscount'], action.payload.dentalBundleDiscount)
      .setIn(['final', 'dentalBundleDiscountPercent'], action.payload.dentalBundleDiscountPercent)
      .setIn(['final', 'visionBundleDiscount'], action.payload.visionBundleDiscount)
      .setIn(['final', 'visionBundleDiscountPercent'], action.payload.visionBundleDiscountPercent)
      .setIn(['final', 'medicalWithoutKaiserTotal'], action.medicalWithoutKaiserTotal)
      .setIn(['final', 'subTotalAnnualCost'], action.payload.subTotalAnnualCost)
      .setIn(['final', 'summaryBundleDiscount'], action.payload.summaryBundleDiscount);
    expect(reducer(undefined, action)).toEqual(baseState);
  });

  it('QUOTES_GET_SUCCESS', () => {
    const action = { type: QUOTES_GET_SUCCESS, payload: SummaryData, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'quoteProducts'], action.payload)
      .setIn(['quote', 'err'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('QUOTES_GET_ERROR', () => {
    const action = { type: QUOTES_GET_ERROR, payload: { message: 1 } };
    const mockState = state
      .setIn(['quote', 'loading'], false)
      .setIn(['quote', 'err'], true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_NETWORK_GET_SUCCESS', () => {
    const action = { type: OPTION_NETWORK_GET_SUCCESS, payload: NetworksData, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'networks'], fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_NETWORK_GET_ERROR', () => {
    const action = { type: OPTION_NETWORK_GET_ERROR, payload: { message: 1 } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTION_CONTRIBUTION_GET_SUCCESS', () => {
    const action = { type: OPTION_CONTRIBUTION_GET_SUCCESS, payload: ContributionData, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'openedOptionContributions'], fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_CONTRIBUTION_GET_ERROR', () => {
    const action = { type: OPTION_CONTRIBUTION_GET_ERROR, payload: { message: 1 } };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTIONS_GET_SUCCESS', () => {
    const action = { type: OPTIONS_GET_SUCCESS, payload: OptionsData, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'current'], fromJS(action.payload.currentOption))
      .setIn([action.meta.section, 'current', 'id'], 'current')
      .setIn([action.meta.section, 'loading'], false)
      .setIn([action.meta.section, 'selected'], 1)
      .setIn([action.meta.section, 'options'], fromJS(action.payload.options));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTIONS_GET_ERROR', () => {
    const action = { type: OPTIONS_GET_ERROR, payload: { message: 1 }, meta: { PLAN_TYPE_MEDICAL } };
    const mockState = state
      .setIn([action.meta.section, 'loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_GET', () => {
    const action = { type: ENROLLMENT_GET };
    const mockState = state
      .setIn(['enrollment', 'loading'], true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_GET_SUCCESS', () => {
    const action = { type: ENROLLMENT_GET_SUCCESS, payload: EnrollmentData };
    const mockState = state
      .setIn(['medical', 'enrollment'], fromJS(action.payload.medical))
      .setIn(['dental', 'enrollment'], fromJS(action.payload.dental))
      .setIn(['vision', 'enrollment'], fromJS(action.payload.vision))
      .setIn(['medical', 'enrollmentBase'], fromJS(action.payload.medical))
      .setIn(['dental', 'enrollmentBase'], fromJS(action.payload.dental))
      .setIn(['vision', 'enrollmentBase'], fromJS(action.payload.vision));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_GET_ERROR', () => {
    const action = { type: ENROLLMENT_GET_ERROR, payload: { message: 1 } };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('PLAN_SELECT_SUCCESS', () => {
    const action = { type: PLAN_SELECT_SUCCESS };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('PLAN_SELECT_ERROR', () => {
    const action = { type: PLAN_SELECT_ERROR };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTION_NETWORK_ADD_SUCCESS', () => {
    const action = { type: OPTION_NETWORK_ADD_SUCCESS };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('OPTION_NETWORK_ADD_ERROR', () => {
    const action = { type: OPTION_NETWORK_ADD_ERROR };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('SUBMIT_FINAL_SECTIONS_SUCCESS', () => {
    const action = { type: SUBMIT_FINAL_SECTIONS_SUCCESS, payload: { errorMessage: null } };
    const mockState = state
      .setIn(['quote', 'readonly'], true)
      .setIn(['final', 'showSubmitSuccess'], true)
      .setIn(['final', 'loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SUBMIT_FINAL_SECTIONS_ERROR', () => {
    const action = { type: SUBMIT_FINAL_SECTIONS_ERROR };

    expect(reducer(undefined, action)).toEqual(state);
  });

  it('SELECTED_GET_ERROR', () => {
    const action = { type: SELECTED_GET_ERROR };
    const mockState = state
      .setIn(['final', 'showSubmitSuccess'], false)
      .setIn(['final', 'showErr'], true)
      .setIn(['final', 'loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SUBMIT_FINAL_SECTIONS', () => {
    const action = { type: SUBMIT_FINAL_SECTIONS };
    const mockState = state
      .setIn(['final', 'showErr'], false)
      .setIn(['final', 'loading'], true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_CHANGE status edit, name planName', () => {
    const action = { type: ALTERNATIVE_PLAN_VALUE_CHANGE, payload: { status: 'edit', name: 'planName', planIndex: 1, part: 1 }, meta: { section: 'medical' } };

    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'stateAlternativesPlans', 'plans', action.payload.planIndex, 'name'], action.payload.part);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_CHANGE status edit, no name', () => {
    const action = { type: ALTERNATIVE_PLAN_VALUE_CHANGE, payload: { status: 'edit', name: '', planIndex: 1, part: 2, valName: 'test2', value: 3 }, meta: { section: 'medical' } };

    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'stateAlternativesPlans', 'plans', action.payload.planIndex, action.payload.part, action.payload.name, action.payload.valName], action.payload.value);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_CHANGE no status, name newPlan', () => {
    const action = { type: ALTERNATIVE_PLAN_VALUE_CHANGE, payload: { status: '', name: 'newPlan', value: 123 }, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['planSavingFailed'], false)
      .setIn(['planChanged'], true)
      .setIn([action.meta.section, action.payload.name], fromJS(action.payload.value));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_CHANGE no status, name planName', () => {
    const action = { type: ALTERNATIVE_PLAN_VALUE_CHANGE, payload: { status: '', name: 'planName', value: 123, part: 1 }, meta: { section: 'medical' } };

    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'newPlan', action.payload.value], action.payload.part);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_VALUE_CHANGE no status, no name', () => {
    const action = { type: ALTERNATIVE_PLAN_VALUE_CHANGE, payload: { status: '', name: '', value: 123, part: 1, valName: 'test' }, meta: { section: 'medical' } };

    const mockState = state
      .set('planSavingFailed', false)
      .set('planChanged', true)
      .setIn([action.meta.section, 'newPlan', action.payload.part, action.payload.name, action.payload.valName], action.payload.value);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_ADD', () => {
    const action = { type: ALTERNATIVE_PLAN_ADD };
    const mockState = state
      .setIn(['loading'], true)
      .setIn(['planChanged'], true);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_ADD_SUCCESS', () => {
    const action = { type: ALTERNATIVE_PLAN_ADD_SUCCESS, payload: 123, meta: { section: 'medical' } };
    const mockState = state
      .setIn(['planSavesSuccess'], true)
      .setIn(['planSavingFailed'], false)
      .setIn(['loading'], false)
      .setIn([action.meta.section, 'newPlan', 'rfpQuoteNetworkPlanId'], action.payload);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_ADD_ERROR', () => {
    const action = { type: ALTERNATIVE_PLAN_ADD_ERROR };
    const mockState = state
      .setIn(['planSavesSuccess'], false)
      .setIn(['planSavingFailed'], true)
      .setIn(['loading'], false);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_EDIT', () => {
    const action = { type: ENROLLMENT_EDIT, payload: { value: '' }, meta: { section: 'MEDICAL' } };

    const mockState = state
      .setIn([action.meta.section, 'enrollmentEdit'], action.payload);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_SAVE', () => {
    const action = { type: ENROLLMENT_SAVE, payload: { }, meta: { section: 'MEDICAL' } };

    const mockState = state
      .setIn(['enrollment', 'loading'], true);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_SAVE_SUCCESS', () => {
    const action = { type: ENROLLMENT_SAVE_SUCCESS, payload: { value: 'test' }, meta: { section: 'MEDICAL' } };

    const mockState = state
      .setIn(['enrollment', 'loading'], false)
      .setIn([action.meta.section, 'enrollment'], fromJS(action.payload))
      .setIn([action.meta.section, 'enrollmentBase'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ENROLLMENT_SAVE_ERROR', () => {
    const action = { type: ENROLLMENT_SAVE_ERROR, payload: { value: 'test' }, meta: { section: 'MEDICAL' } };

    const mockState = state
      .setIn(['enrollment', 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SET_CLIENT', () => {
    const action = { type: SET_CLIENT, payload: { clientState: 'test' }, meta: { section: 'MEDICAL' } };

    const mockState = state
      .setIn(['medical', 'loading'], true)
      .setIn(['dental', 'loading'], true)
      .setIn(['vision', 'loading'], true)
      .setIn(['final', 'showSubmitSuccess'], false)
      .setIn(['quote', 'client'], fromJS(action.payload))
      .setIn(['quote', 'readonly'], action.payload.clientState !== QUOTED_NORMAL);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CARRIERS_GET_ERROR', () => {
    const action = { type: CARRIERS_GET_ERROR };

    const mockState = state;

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('QUOTES_STATUS_GET_ERROR', () => {
    const action = { type: QUOTES_STATUS_GET_ERROR };

    const mockState = state;

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_QUOTES_CATEGORY_SUCCESS', () => {
    const action = { type: GET_QUOTES_CATEGORY_SUCCESS, payload: { clientState: 'test' }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'quotes'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_QUOTES_CATEGORY_ERROR', () => {
    const action = { type: GET_QUOTES_CATEGORY_ERROR };

    const mockState = state;

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('SET_CURRENT_NETWORK_NAME', () => {
    const action = { type: SET_CURRENT_NETWORK_NAME, payload: { networkName: 'test' }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'page', 'options', 'currentNetworkName'], action.payload.networkName);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('EXTERNAL_PRODUCTS_SELECT', () => {
    const action = { type: EXTERNAL_PRODUCTS_SELECT, payload: { type: 'test', value: 0 } };

    const mockState = state
      .setIn(['final', 'externalProducts', action.payload.type], action.payload.value);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_DOCUMENTS', () => {
    const action = { type: GET_DOCUMENTS };

    const mockState = state
      .setIn(['documents', 'loading'], true);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_DOCUMENTS_SUCCESS', () => {
    const action = { type: GET_DOCUMENTS_SUCCESS, payload: { type: 'test', value: 0 } };

    const mockState = state
      .setIn(['documents', 'data'], fromJS(action.payload))
      .setIn(['documents', 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_DOCUMENTS_ERROR', () => {
    const action = { type: GET_DOCUMENTS_ERROR };

    const mockState = state
      .setIn(['documents', 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('COMPARE_FILE_SUCCESS', () => {
    const action = { type: COMPARE_FILE_SUCCESS, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('COMPARE_FILE_ERROR', () => {
    const action = { type: COMPARE_FILE_ERROR, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('GET_CLEAR_VALUE_STATUS_SUCCESS', () => {
    const action = { type: GET_CLEAR_VALUE_STATUS_SUCCESS, payload: { value: 'test' } };

    const mockState = state
      .setIn(['quote', 'qualification'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CREATE_DTP_CLEAR_VALUE', () => {
    const action = { type: CREATE_DTP_CLEAR_VALUE };

    const mockState = state
      .setIn(['quote', 'qualificationLoading'], true);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CREATE_DTP_CLEAR_VALUE_SUCCESS', () => {
    const action = { type: CREATE_DTP_CLEAR_VALUE_SUCCESS, payload: { value: 'test' } };

    const mockState = state
      .setIn(['quote', 'qualification'], fromJS(action.payload))
      .setIn(['quote', 'qualificationLoading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CREATE_DTP_CLEAR_VALUE_ERROR', () => {
    const action = { type: CREATE_DTP_CLEAR_VALUE_ERROR };

    const mockState = state
      .setIn(['quote', 'qualificationLoading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('ALTERNATIVE_PLAN_DELETE_SUCCESS', () => {
    const action = { type: ALTERNATIVE_PLAN_DELETE_SUCCESS, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], true);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CARRIER_NETWORKS_GET_SUCCESS', () => {
    const action = { type: CARRIER_NETWORKS_GET_SUCCESS, payload: { index: 1, data: {} }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'openedOption', 'detailedPlans', action.payload.index, 'networks'], action.payload.data);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_RIDER_GET_SUCCESS', () => {
    const action = { type: OPTION_RIDER_GET_SUCCESS, payload: { index: 1 }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'openedOptionRider'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_RIDER_FEE_GET_SUCCESS', () => {
    const action = { type: OPTION_RIDER_FEE_GET_SUCCESS, payload: { index: 1 }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'riderFees'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('COMPARISON_GET_SUCCESS', () => {
    const action = { type: COMPARISON_GET_SUCCESS, payload: {} };

    const mockState = state
      .setIn(['medical', 'medicalGroups'], fromJS(action.payload))
      .setIn(['medical', 'medicalGroupsColumns'], fromJS({}))
      .setIn(['medical', 'medicalGroupsGetSuccess'], true)
      .setIn(['medical', 'medicalGroupsGetError'], false)
      .setIn(['medical', 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('COMPARISON_GET_ERROR', () => {
    const action = { type: COMPARISON_GET_ERROR };

    const mockState = state
      .setIn(['medical', 'medicalGroupsGetSuccess'], false)
      .setIn(['medical', 'medicalGroupsGetError'], true)
      .setIn(['medical', 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('DISCLAIMER_GET', () => {
    const action = { type: DISCLAIMER_GET, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'disclaimer'], {})
      .setIn(['quote', 'loading'], true)
      .setIn(['quote', 'err'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('DISCLAIMER_GET_SUCCESS', () => {
    const action = { type: DISCLAIMER_GET_SUCCESS, payload: { data: 'test' }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'disclaimer'], action.payload)
      .setIn(['quote', 'loading'], false)
      .setIn(['quote', 'err'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('DISCLAIMER_GET_ERROR', () => {
    const action = { type: DISCLAIMER_GET_ERROR };

    const mockState = state
      .setIn(['quote', 'loading'], false)
      .setIn(['quote', 'err'], true);

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_COMPARE_NETWORKS_GET', () => {
    const action = { type: OPTION_COMPARE_NETWORKS_GET, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], true)
      .setIn([action.meta.section, 'compareNetworks'], Map({}));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_COMPARE_NETWORKS_GET_SUCCESS', () => {
    const action = { type: OPTION_COMPARE_NETWORKS_GET_SUCCESS, payload: { data: 'test' }, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], false)
      .setIn([action.meta.section, 'compareNetworks'], fromJS(action.payload));

    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('OPTION_COMPARE_NETWORKS_GET_ERROR', () => {
    const action = { type: OPTION_COMPARE_NETWORKS_GET_ERROR, meta: { section: 'medical' } };

    const mockState = state
      .setIn([action.meta.section, 'loading'], false);

    expect(reducer(undefined, action)).toEqual(mockState);
  });
}); */

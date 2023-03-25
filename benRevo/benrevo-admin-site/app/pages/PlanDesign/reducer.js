import { fromJS } from 'immutable';
import * as types from './constants';
import { getBenefitNames } from './selectors';

const initialState = fromJS({
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

function PlanDesignReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE_YEAR: {
      return state
        .set('inputYear', action.payload)
        .set('fileName', '');
    }
    case types.GET_CHANGES: {
      return state
        .set('loading', true)
        .set('fileName', '');
    }
    case types.GET_CHANGES_SUCCESS: {
      return state
        .set('loading', false)
        .set('changes', fromJS(action.payload.data))
        .set('fileName', action.payload.fileName);
    }
    case types.GET_CHANGES_ERROR: {
      return state
        .set('loading', false);
    }
    case types.UPLOAD_PLAN: {
      return state
        .set('uploadLoading', true);
    }
    case types.UPLOAD_PLAN_SUCCESS: {
      return state
        .set('uploadLoading', false)
        .set('fileName', '')
        .set('changes', fromJS({}));
    }
    case types.UPLOAD_PLAN_ERROR: {
      return state
        .set('uploadLoading', false);
    }
    case types.GET_PLAN_DESIGN: {
      return state
        .set('viewProgress', 0)
        .set('viewLoading', true);
    }
    case types.GET_PLAN_DESIGN_SUCCESS: {
      const benefitNames = getBenefitNames(action.payload);
      return state
        .set('planDesignData', fromJS(action.payload))
        .set('benefitNames', fromJS(benefitNames))
        .set('viewLoading', initialState.get('viewLoading'));
    }
    case types.GET_PLAN_DESIGN_ERROR: {
      return state
        .set('viewLoading', initialState.get('viewLoading'));
    }
    case types.GET_PLAN_TYPES: {
      return state
        .set('loadingTypes', true);
    }
    case types.GET_PLAN_TYPES_SUCCESS: {
      return state
        .set('planTypeList', fromJS(action.payload))
        .set('loadingTypes', false);
    }
    case types.GET_PLAN_TYPES_ERROR: {
      return state
        .set('loadingTypes', false);
    }
    case types.CHANGE_PLAN_TYPE: {
      return state
        .set('planType', action.payload);
    }
    case types.UPDATE_PROGRESS: {
      return state
        .set('viewProgress', action.payload);
    }
    default:
      return state;
  }
}

export default PlanDesignReducer;

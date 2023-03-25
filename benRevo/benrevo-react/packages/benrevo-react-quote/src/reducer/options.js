import { fromJS, List } from 'immutable';
import * as types from '../constants';

export function optionsGet(state, action) {
  return state
    .setIn([action.meta.section, 'options'], fromJS([]))
    .setIn([action.meta.section, 'current'], fromJS({}))
    .setIn([action.meta.section, 'loading'], true)
    .setIn([action.meta.section, 'loadingOptions'], true);
}

export function optionsGetSuccess(state, action) {
  let selected = 0;

  if (action.payload.options) {
    action.payload.options.map((item) => {
      if (item.selected) selected = item.id;
      return true;
    });
  }

  return state
    .setIn([action.meta.section, 'current'], fromJS(action.payload.currentOption))
    .setIn([action.meta.section, 'current', 'id'], 'current')
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'loadingOptions'], false)
    .setIn([action.meta.section, 'selected'], selected)
    .setIn([action.meta.section, 'options'], fromJS(action.payload.options || []));
}

export function optionsGetError(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'loadingOptions'], false);
}

export function optionsDelete(state, action) {
  let currentState = state.get(action.meta.section);
  const options = currentState.get('options');
  const checkedOptions = currentState.get('checkedOptions');
  const id = action.payload.optionId;
  options.map((item, i) => {
    if (item.get('id') === id) {
      currentState = currentState.deleteIn(['options', i]);
      if (id === currentState.get('selected')) currentState = currentState.set('selected', 0);
      return true;
    }

    return false;
  });

  checkedOptions.map((item, i) => {
    if (item === id) {
      currentState = currentState.deleteIn(['checkedOptions', i]);
      return true;
    }

    return false;
  });

  return state
    .set(action.meta.section, currentState);
}

export function optionsSelectSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'selected'], action.payload.id);
}

export function optionsUnselectSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'selected'], null);
}

export function optionCheck(state, action) {
  let checkedOptions = state.get(action.meta.section).get('checkedOptions');
  const id = action.payload.id;
  let found;

  checkedOptions.map((item, i) => {
    if (item === id) {
      checkedOptions = checkedOptions.delete(i);
      found = true;
      return true;
    }

    return false;
  });

  if (!found) {
    if (checkedOptions.size === 3) checkedOptions = checkedOptions.delete(0);

    checkedOptions = checkedOptions.push(id);
  }

  const sorted = checkedOptions.toJS().sort((a, b) => a > b);

  return state
    .setIn([action.meta.section, 'load', 'compare'], true)
    .setIn([action.meta.section, 'checkedOptions'], fromJS(sorted));
}

export function compareFile(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true);
}

export function compareFileSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false);
}

export function compareFileError(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false);
}

export function compareGet(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], true)
    .setIn([action.meta.section, 'compareOptions'], List());
}

export function compareGetSuccess(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false)
    .setIn([action.meta.section, 'compareOptions'], fromJS(action.payload));
}

export function compareGetError(state, action) {
  return state
    .setIn([action.meta.section, 'loading'], false);
}

export function getClearValueStatusSuccess(state, action) {
  return state
    .setIn(['quote', 'qualification'], fromJS(action.payload));
}

export function createDtpClearValue(state) {
  return state
    .setIn(['quote', 'qualificationLoading'], true);
}

export function createDtpClearValueSuccess(state) {
  return state
    .setIn(['quote', 'qualificationLoading'], true);
}

export function createDtpClearValueError(state) {
  return state
    .setIn(['quote', 'qualificationLoading'], true);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.OPTIONS_GET: return optionsGet(state, action);
    case types.OPTIONS_GET_SUCCESS: return optionsGetSuccess(state, action);
    case types.OPTIONS_GET_ERROR: return optionsGetError(state, action);
    case types.OPTIONS_DELETE: return optionsDelete(state, action);
    case types.OPTIONS_SELECT_SUCCESS: return optionsSelectSuccess(state, action);
    case types.OPTIONS_UNSELECT_SUCCESS: return optionsUnselectSuccess(state, action);
    case types.OPTION_CHECK: return optionCheck(state, action);
    case types.COMPARE_FILE: return compareFile(state, action);
    case types.COMPARE_FILE_SUCCESS: return compareFileSuccess(state, action);
    case types.COMPARE_FILE_ERROR: return compareFileError(state, action);
    case types.COMPARE_GET: return compareGet(state, action);
    case types.COMPARE_GET_SUCCESS: return compareGetSuccess(state, action);
    case types.COMPARE_GET_ERROR: return compareGetError(state, action);
    case types.GET_CLEAR_VALUE_STATUS_SUCCESS: return getClearValueStatusSuccess(state, action);
    case types.CREATE_DTP_CLEAR_VALUE: return createDtpClearValue(state, action);
    case types.CREATE_DTP_CLEAR_VALUE_SUCCESS: return createDtpClearValueSuccess(state, action);
    case types.CREATE_DTP_CLEAR_VALUE_ERROR: return createDtpClearValueError(state, action);
    default: return state;
  }
}

import * as types from '../constants';

export function disclaimerGet(state, action) {
  return state
    .setIn(['disclaimer', 'disclosures'], action.payload)
    .setIn(['disclaimer', 'loading'], true)
    .setIn(['disclaimer', 'err'], false);
}

export function changeDropdown(state, action) {
  return state
    .setIn(['disclaimer', 'dropdownValue'], action.payload.value);
}

export function disclaimerGetSuccess(state, action) {
  return state
    .setIn(['disclaimer', 'disclosures'], action.payload)
    .setIn(['disclaimer', 'loading'], false)
    .setIn(['disclaimer', 'err'], false);
}

export function disclaimerGetError(state) {
  return state
    .setIn(['disclaimer', 'loading'], false)
    .setIn(['disclaimer', 'err'], true);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.GET_DISCLAIMERS_DATA: return disclaimerGet(state, action);
    case types.GET_DISCLAIMERS_SUCCESS: return disclaimerGetSuccess(state, action);
    case types.GET_DISCLAIMERS_ERROR: return disclaimerGetError(state, action);
    case types.CHANGE_DISCLAIMERS_DROPDOWN_DATA: return changeDropdown(state, action);
    default: return state;
  }
}

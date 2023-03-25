import { fromJS, Map } from 'immutable';
import validator from 'validator';
import * as types from '../constants';

export function enrollmentChange(state, action) {
  const payload = action.payload;
  const currentValue = state
    .get(action.meta.section)
    .get('enrollment')
    .get('contributions')
    .get(payload.column)
    .get('values')
    .get(payload.index)
    .get('value');
  let value = payload.value;

  if (payload.value !== '' && !validator.isInt(payload.value) && !validator.isFloat(payload.value)) {
    value = currentValue;
  }

  return state
    .setIn([action.meta.section, 'enrollment', 'contributions', action.payload.column, 'values', action.payload.index], Map({ value }));
}

export function enrollmentCancel(state, action) {
  return state
    .setIn([action.meta.section, 'enrollment'], state.get(action.meta.section).get('enrollmentBase'));
}

export function enrollmentEdit(state, action) {
  return state
    .setIn([action.meta.section, 'enrollmentEdit'], action.payload);
}

export function enrollmentGet(state) {
  return state
    .setIn(['enrollment', 'loading'], true)
    .setIn(['medical', 'enrollmentEdit'], false)
    .setIn(['dental', 'enrollmentEdit'], false)
    .setIn(['vision', 'enrollmentEdit'], false);
}

export function enrollmentGetSuccess(state, action) {
  const medical = fromJS(action.payload.medical);
  const dental = fromJS(action.payload.dental);
  const vision = fromJS(action.payload.vision);
  return state
    .setIn(['enrollment', 'loading'], false)
    .setIn(['medical', 'enrollment'], medical)
    .setIn(['dental', 'enrollment'], dental)
    .setIn(['vision', 'enrollment'], vision)
    .setIn(['medical', 'enrollmentBase'], medical)
    .setIn(['dental', 'enrollmentBase'], dental)
    .setIn(['vision', 'enrollmentBase'], vision);
}

export function enrollmentGetError(state) {
  return state
    .setIn(['enrollment', 'loading'], false);
}

export function enrollmentSave(state) {
  return state
    .setIn(['enrollment', 'loading'], true);
}

export function enrollmentSaveSuccess(state, action) {
  return state
    .setIn(['enrollment', 'loading'], false)
    .setIn([action.meta.section, 'enrollment'], fromJS(action.payload))
    .setIn([action.meta.section, 'enrollmentBase'], fromJS(action.payload));
}

export function enrollmentSaveError(state) {
  return state
    .setIn(['enrollment', 'loading'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.ENROLLMENT_CHANGE: return enrollmentChange(state, action);
    case types.ENROLLMENT_CANCEL: return enrollmentCancel(state, action);
    case types.ENROLLMENT_EDIT: return enrollmentEdit(state, action);
    case types.ENROLLMENT_GET: return enrollmentGet(state, action);
    case types.ENROLLMENT_GET_SUCCESS: return enrollmentGetSuccess(state, action);
    case types.ENROLLMENT_GET_ERROR: return enrollmentGetError(state, action);
    case types.ENROLLMENT_SAVE: return enrollmentSave(state, action);
    case types.ENROLLMENT_SAVE_SUCCESS: return enrollmentSaveSuccess(state, action);
    case types.ENROLLMENT_SAVE_ERROR: return enrollmentSaveError(state, action);
    default: return state;
  }
}

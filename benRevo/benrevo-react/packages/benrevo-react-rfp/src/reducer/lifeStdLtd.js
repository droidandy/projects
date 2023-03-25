import { fromJS } from 'immutable';
import { createLifeStdLTdPlanClass, checkButtonAddStatus, createLifeStdLTdPlanAgeRates } from './state';
import * as types from '../constants';

export function changeLifeStdLtdPlan(state, action) {
  return state
    .setIn([action.meta.section, action.payload.type, action.payload.key], action.payload.value);
}

export function addLifeStdLtdPlan(state, action) {
  let lifeStdLtdPlans = state
    .get(action.meta.section).get(action.payload.type).get('classes');

  lifeStdLtdPlans = lifeStdLtdPlans.push(createLifeStdLTdPlanClass(action.meta.section, action.payload.type));

  return state
    .setIn([action.meta.section, action.payload.type, 'classes'], lifeStdLtdPlans);
}

export function removeLifeStdLtdPlan(state, action) {
  let lifeStdLtdPlans = state
    .get(action.meta.section).get(action.payload.type).get('classes');

  lifeStdLtdPlans = lifeStdLtdPlans.pop();
  return state
    .setIn([action.meta.section, action.payload.type, 'classes'], lifeStdLtdPlans);
}

export function changeLifeStdLtdPlanClass(state, action) {
  return state
    .setIn([action.meta.section, action.payload.type, 'classes', action.payload.index, action.payload.key], action.payload.value);
}

export function changeRateField(state, action) {
  return state
    .setIn([action.meta.section, action.payload.planType, 'rates', action.payload.rateField], fromJS(action.payload.value));
}

export function changeRateAgeField(state, action) {
  const ages = state.get(action.meta.section).get('voluntaryPlan').get('rates').get('ages').toJS();
  const currentRow = state.get(action.meta.section).get('voluntaryPlan').get('rates').get('ages').get(action.payload.index).toJS();
  let value = action.payload.value;

  // changing ages range fields
  if (action.payload.field === 'to') {
    ages[action.payload.index].to = action.payload.value;
    const flag = checkButtonAddStatus(ages, action.payload.index);
    let addNewRangeFirstDisabled = flag.addNewRangeFirstDisabled;
    const addNewRangeLastDisabled = flag.addNewRangeLastDisabled;
    const maxFirstIndex = flag.maxFirstIndex;
    const maxLastIndex = flag.maxLastIndex;

    if ((!value && currentRow.from < 30)
      // from should be less than to
      || (currentRow.from >= action.payload.value && currentRow.from.toString().length === action.payload.value.toString().length)
      // first block should be less than 29
      || (action.payload.index < 8 && action.payload.value > 29)
      // last block should be more than 69
      || (action.payload.index > 8 && action.payload.value < 69 && action.payload.value.toString().length > 2)
      // last block should be less than 101
      || (action.payload.index > 8 && action.payload.value > 100)
    ) {
      value = currentRow.from + 2;
      addNewRangeFirstDisabled = false;
    }

    // console.log(action.payload.value, currentRow.from.toString(), action.payload.value.toString(), action.payload.index);
    return state
      .setIn([action.meta.section, 'addNewRangeFirstDisabled'], fromJS(addNewRangeFirstDisabled))
      .setIn([action.meta.section, 'addNewRangeLastDisabled'], fromJS(addNewRangeLastDisabled))
      .setIn([action.meta.section, 'maxFirstIndex'], fromJS(maxFirstIndex))
      .setIn([action.meta.section, 'maxLastIndex'], fromJS(maxLastIndex))
      .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages', action.payload.index, action.payload.field], value);
  }
  return state
    .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages', action.payload.index, action.payload.field], fromJS(value));
}

export function changeAgesRowsCount(state, action) {
  const agesArr = state.get(action.meta.section).get('voluntaryPlan').get('rates').get('ages').toJS();
  let flag = checkButtonAddStatus(agesArr, action.payload.index);
  let addNewRangeFirstDisabled = flag.addNewRangeFirstDisabled;
  let addNewRangeLastDisabled = flag.addNewRangeLastDisabled;
  let maxFirstIndex = flag.maxFirstIndex;
  let maxLastIndex = flag.maxLastIndex;
  const newMaxFirstIndex = maxFirstIndex;
  const newMaxLastIndex = maxLastIndex;
  let index = 0;
  if (action.payload.actionType === 'add') {
    index = (action.payload.position === 1) ? newMaxFirstIndex : newMaxLastIndex;
    if (index < 8) {
      addNewRangeFirstDisabled = true;
    } else {
      addNewRangeLastDisabled = true;
    }
    const to = parseInt(agesArr[index].to, 0);
    const newElem = createLifeStdLTdPlanAgeRates(action.meta.section, to + 1, null);
    if (action.payload.position === 1) {
      newElem.to = 29;
      maxFirstIndex += 1;
      maxLastIndex += 1;
    } else {
      newElem.to = null;
      maxLastIndex += 1;
    }
    agesArr.splice(index + 1, 0, newElem);
  } else {
    index = action.payload.index;
    if (index < 8) {
      addNewRangeFirstDisabled = false;
    } else {
      addNewRangeLastDisabled = false;
    }
    agesArr.splice(index, 1);
    flag = checkButtonAddStatus(agesArr, action.payload.index);
    maxFirstIndex = flag.maxFirstIndex;
    maxLastIndex = flag.maxLastIndex;
  }
  return state
    .setIn([action.meta.section, 'addNewRangeFirstDisabled'], fromJS(addNewRangeFirstDisabled))
    .setIn([action.meta.section, 'addNewRangeLastDisabled'], fromJS(addNewRangeLastDisabled))
    .setIn([action.meta.section, 'maxFirstIndex'], fromJS(maxFirstIndex))
    .setIn([action.meta.section, 'maxLastIndex'], fromJS(maxLastIndex))
    .setIn([action.meta.section, 'voluntaryPlan', 'rates', 'ages'], fromJS(agesArr));
}

export function reducer(state = [], action) {
  switch (action.type) {
    case types.CHANGE_LIFE_STD_LTD_PLAN: return changeLifeStdLtdPlan(state, action);
    case types.ADD_LIFE_STD_LTD_PLAN: return addLifeStdLtdPlan(state, action);
    case types.REMOVE_LIFE_STD_LTD_PLAN: return removeLifeStdLtdPlan(state, action);
    case types.CHANGE_LIFE_STD_LTD_PLAN_CLASS: return changeLifeStdLtdPlanClass(state, action);
    case types.CHANGE_RATE_FIELD: return changeRateField(state, action);
    case types.CHANGE_RATE_AGE_FIELD: return changeRateAgeField(state, action);
    case types.CHANGE_AGES_ROWS_COUNT: return changeAgesRowsCount(state, action);
    default: return state;
  }
}

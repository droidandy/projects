/*
 *
 * PlanDesign Actions
 *
 */

import * as types from './constants';

export function getChanges(carrier, file) {
  return {
    type: types.GET_CHANGES,
    payload: { carrier, file },
  };
}

export function changeYear(year) {
  return {
    type: types.CHANGE_YEAR,
    payload: year,
  };
}

export function uploadPlan(carrier, file) {
  return {
    type: types.UPLOAD_PLAN,
    payload: { carrier, file },
  };
}

export function getPlanDesign(carrier, year, planType) {
  return {
    type: types.GET_PLAN_DESIGN,
    payload: { carrier, year, planType },
  };
}

export function getPlanTypes(carrier) {
  return {
    type: types.GET_PLAN_TYPES,
    payload: carrier,
  };
}

export function changePlanType(type) {
  return {
    type: types.CHANGE_PLAN_TYPE,
    payload: type,
  };
}

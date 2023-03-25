import * as types from './constants';

export function getRewards(filter) {
  return {
    type: types.REWARDS_GET,
    payload: filter,
  };
}

export function changeFilter(type, value) {
  return {
    type: types.CHANGE_FILTER,
    payload: { type, value },
  };
}

export function changeSort(prop, order) {
  return {
    type: types.CHANGE_SORT,
    payload: { prop, order },
  };
}

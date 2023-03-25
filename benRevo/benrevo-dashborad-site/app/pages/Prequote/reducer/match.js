import {
  CREATE_CLIENT_PLANS,
  CREATE_CLIENT_PLANS_SUCCESS,
  CREATE_CLIENT_PLANS_ERROR,
} from '../constants';

export function createClientPlans(state) {
  return state
    .setIn(['match', 'creatingPlans'], true);
}

export function createClientPlansSuccess(state) {
  return state
    .setIn(['match', 'creatingPlans'], false);
}

export function createClientPlansError(state) {
  return state
    .setIn(['match', 'creatingPlans'], false);
}

export function reducer(state = [], action) {
  switch (action.type) {
    case CREATE_CLIENT_PLANS: return createClientPlans(state, action);
    case CREATE_CLIENT_PLANS_SUCCESS: return createClientPlansSuccess(state, action);
    case CREATE_CLIENT_PLANS_ERROR: return createClientPlansError(state, action);
    default: return state;
  }
}

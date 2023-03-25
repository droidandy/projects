import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';

export const initialState = fromJS({
  loading: false,
});

export function EmployeeApplication(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({
  main: EmployeeApplication,
});

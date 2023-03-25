import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';

const initialState = fromJS({
  loading: false,
});

function cptureRatesReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default combineReducers({
  main: cptureRatesReducer,
});

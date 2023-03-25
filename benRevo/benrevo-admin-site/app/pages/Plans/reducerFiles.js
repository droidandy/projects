import { fromJS } from 'immutable';
import * as types from './constants';
import * as homeTypes from './../Client/constants';

const initialState = fromJS({
  quotes: {
    DHMO: null,
    DPPO: [],
  },
  preview: {
    DHMO: null,
    DPPO: [],
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPLOAD_DENTAL_QUOTE: {
      return state.setIn([action.payload.actionType, action.payload.type], action.payload.files);
    }
    case homeTypes.CHANGE_CLIENTS: {
      return state.setIn(['preview'], initialState.get('preview'))
        .setIn(['quotes'], initialState.get('quotes'));
    }
    case types.DELETE_QUOTE_SUCCESS: {
      if (action.payload.quoteType === 'dental') {
        return state
          .setIn(['preview'], initialState.get('preview'))
          .setIn(['quotes'], initialState.get('quotes'));
      }
      return state;
    }
    default:
      return state;
  }
}

export default appReducer;

import { fromJS } from 'immutable';
import * as types from './constants';

// The initial state of the App
const initialState = fromJS({
  NewRfps: {},
  InProgress: {},
  loading: false,
  sort: {
    prop: 'effectiveDate',
    order: 'descending',
  },
});

function preQuotedReducer(state = initialState, action) {
  switch (action.type) {
    case types.PRE_QUOTED_GET:
      return state
        .set('loading', true);
    case types.PRE_QUOTED_GET_SUCCESS: {
      const quotes = action.payload;
      return state
        .set('loading', false)
        .set('NewRfps', fromJS(quotes.NewRfps))
        .set('InProgress', fromJS(quotes.InProgress));
    }
    case types.PRE_QUOTED_GET_ERROR:
      return state
        .set('loading', false);
    case types.CHANGE_PRE_QUOTED_SORT: {
      const prop = action.payload.prop;
      let sort = state.get('sort');
      if (sort.get('prop') === prop) {
        if (sort.get('order') === 'ascending') sort = sort.set('order', 'descending');
        else {
          sort = sort.set('order', 'ascending');
        }
      } else {
        sort = sort.set('prop', prop).set('order', 'ascending');
      }

      return state
        .setIn(['sort'], sort);
    }
    default:
      return state;
  }
}

export default preQuotedReducer;

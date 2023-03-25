/**
 * Created by ryanford on 3/7/17.
 */

import { fromJS } from 'immutable';

// user empty strings here instead of null, due to form validation
const initialState = fromJS({
  loading: true,
});

function Options(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default Options;

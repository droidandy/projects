import { fromJS } from 'immutable';

const initialState = fromJS({
  loading: false,
});

function InfoClientReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default InfoClientReducer;

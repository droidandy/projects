import { fromJS } from 'immutable';
import reducer from '../reducer';

describe('InfoClientReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: false,
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });
});

import { fromJS } from 'immutable';
import reducer from '../reducer';

describe('Quote', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      loading: true,
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });
});

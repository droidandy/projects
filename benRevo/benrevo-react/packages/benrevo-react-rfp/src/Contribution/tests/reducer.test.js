import { fromJS } from 'immutable';
import reducer from '../reducer';

describe('Contribution', () => {
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

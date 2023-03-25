import { fromJS } from 'immutable';
import reducer from '../reducer';

describe('carrierReducer', () => {
  let state;
  beforeEach(() => {
    state = fromJS({
      main: {
        loading: false,
      },
    });
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(state);
  });
});

import { fromJS } from 'immutable';
import { DEFAULT_ACTION } from './../actions';
import companyDetailPageReducer from './../reducer';

describe('companyDetailPageReducer', () => {
  let state;

  beforeEach(() => {
    state = fromJS({});
  });

  it('returns the initial state', () => {
    expect(companyDetailPageReducer(undefined, {})).toEqual(state);
  });

  it('DEFAULT_ACTION', () => {
    const mockAction = { type: DEFAULT_ACTION };
    expect(companyDetailPageReducer(undefined, mockAction)).toEqual(state);
  });
});

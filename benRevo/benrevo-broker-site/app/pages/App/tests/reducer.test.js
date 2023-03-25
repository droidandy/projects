import { fromJS } from 'immutable';
import reducer from '../reducer';
import * as types from '../constants';

describe('appReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      error: false,
      currentUser: false,
      showMobileNav: false,
      checkingRole: true,
      rfpcarriers: {
        medical: [],
        dental: [],
        vision: [],
        life: [],
        vol_life: [],
        std: [],
        vol_std: [],
        ltd: [],
        vol_ltd: [],
      },
    });
  });

  it('initial state', () => {
    const action = { type: undefined };
    const mockState = state;
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('TOGGLE_MOBILE_NAV', () => {
    const action = { type: types.TOGGLE_MOBILE_NAV };
    const mockState = state
      .set('showMobileNav', !state.get('showMobileNav'));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECKING_ROLE', () => {
    const action = { type: types.CHECKING_ROLE, payload: 'test' };
    const mockState = state
      .set('checkingRole', action.payload);
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

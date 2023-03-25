import { fromJS } from 'immutable';
import 'moment/locale/en-gb';
// import moment from 'moment';
import * as types from '../constants';
import reducer from '../reducer';

describe('appReducer', () => {
  let state;

  beforeAll(() => {
    state = fromJS({
      loading: false,
      carriersLoaded: false,
      error: false,
      currentUser: false,
      showMobileNav: false,
      checkingRole: true,
      carriers: {
        medical: [],
        dental: [],
        vision: [],
      },
      sae: [],
      brokers: [],
      mainCarrier: {},
      rfpcarriers: {
        medical: [],
        dental: [],
        vision: [],
      },
    });
  });

  it('default', () => {
    const action = { type: undefined };
    expect(reducer(undefined, action)).toEqual(state);
  });

  it('TOGGLE_MOBILE_NAV', () => {
    const action = { type: types.TOGGLE_MOBILE_NAV };
    const mockState = state
      .set('showMobileNav', !state.get('showMobileNav'));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CHECKING_ROLE', () => {
    const action = { type: types.CHECKING_ROLE, payload: { id: '123' } };
    const mockState = state
      .set('checkingRole', action.payload);
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('CARRIERS_GET_SUCCESS', () => {
    const action = { type: types.CARRIERS_GET_SUCCESS, payload: { medical: [], dental: [], vision: [] } };
    const mainCarrier = {};
    const mockState = state
      .setIn(['mainCarrier'], mainCarrier)
      .set('carriersLoaded', true)
      .set('carriers', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('PERSONS_GET_SUCCESS', () => {
    const action = { type: types.PERSONS_GET_SUCCESS, payload: [{ fullName: '123' }, { fullName: '234' }] };
    const mockState = state
      .set('sae', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });

  it('BROKERS_GET_SUCCESS', () => {
    const action = { type: types.BROKERS_GET_SUCCESS, payload: [{ name: '123' }, { name: '234' }] };
    const mockState = state
      .set('brokers', fromJS(action.payload));
    expect(reducer(undefined, action)).toEqual(mockState);
  });
});

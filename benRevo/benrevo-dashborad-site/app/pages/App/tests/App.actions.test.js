import * as actions from './../actions';
import * as types from './../constants';
import { CHECK_VERSION } from './../../../utils/version';

describe('presentation actions', () => {
  it('clearStore', () => {
    const expected = {
      type: types.CLEAR,
    };
    expect(actions.clearStore()).toEqual(expected);
  });

  it('setCheckingRole', () => {
    const expected = {
      type: types.CHECKING_ROLE,
      payload: true,
    };
    expect(actions.setCheckingRole(true)).toEqual(expected);
  });

  it('getPersons', () => {
    const expected = {
      type: types.PERSONS_GET,
    };
    expect(actions.getPersons()).toEqual(expected);
  });

  it('getCarriers', () => {
    const expected = {
      type: types.CARRIERS_GET,
    };
    expect(actions.getCarriers()).toEqual(expected);
  });

  it('getBrokers', () => {
    const expected = {
      type: types.BROKERS_GET,
    };
    expect(actions.getBrokers()).toEqual(expected);
  });

  it('toggleMobileNav', () => {
    const expected = {
      type: types.TOGGLE_MOBILE_NAV,
    };
    expect(actions.toggleMobileNav()).toEqual(expected);
  });

  it('checkVersion', () => {
    const expected = {
      type: CHECK_VERSION,
      status: '123',
    };
    expect(actions.checkVersion('123')).toEqual(expected);
  });
});

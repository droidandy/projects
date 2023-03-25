
import * as actions from '../authService/actions';
import * as types from '../authService/constants';

describe('autoService actions', () => {
  describe('setProfile', () => {
    it('has a type of SET_PROFILE', () => {
      const profile = '123';
      const expected = {
        type: types.SET_PROFILE,
        profile,
      };
      expect(actions.setProfile(profile)).toEqual(expected);
    });
  });
  describe('logout', () => {
    it('has a type of LOGOUT', () => {
      const expected = {
        type: types.LOGOUT,
      };
      expect(actions.logout()).toEqual(expected);
    });
  });
  describe('checkRole', () => {
    it('has a type of CHECK_ROLE', () => {
      const expected = {
        type: types.CHECK_ROLE,
        payload: { skipStatus: true, nextPathname: '/' },
      };
      expect(actions.checkRole(true, '/')).toEqual(expected);
    });
  });
  describe('setExpired', () => {
    it('has a type of ERROR_EXPIRED', () => {
      const expired = '123';
      const expected = {
        type: types.ERROR_EXPIRED,
        payload: expired,
      };
      expect(actions.setExpired(expired)).toEqual(expected);
    });
  });
  describe('setErrorPermission', () => {
    it('has a type of ERROR_PERMISSION', () => {
      const error = '123';
      const expected = {
        type: types.ERROR_PERMISSION,
        payload: error,
      };
      expect(actions.setErrorPermission(error)).toEqual(expected);
    });
  });
});

import { CHECK_VERSION } from '@benrevo/benrevo-react-core';
import {
  checkingRole,
  toggleMobileNav,
  checkVersion,
} from '../actions';
import { CHECKING_ROLE, TOGGLE_MOBILE_NAV } from '../constants';

describe('App actions', () => {
  describe('checkingRole', () => {
    const checking = '';
    it('has a type of CHECKING_ROLE', () => {
      const expected = {
        type: CHECKING_ROLE,
        payload: checking,
      };
      expect(checkingRole(checking)).toEqual(expected);
    });
  });
  describe('toggleMobileNav', () => {
    it('has a type of TOGGLE_MOBILE_NAV', () => {
      const expected = {
        type: TOGGLE_MOBILE_NAV,
      };
      expect(toggleMobileNav()).toEqual(expected);
    });
  });
  describe('checkVersion', () => {
    it('has a type of CHECK_VERSION', () => {
      const status = '';
      const expected = {
        type: CHECK_VERSION,
        status,
      };
      expect(checkVersion(status)).toEqual(expected);
    });
  });
});

import {
  defaultLoginAction,
  DEFAULT_LOGIN_ACTION,
} from '@benrevo/benrevo-react-core';

describe('LoginPage actions', () => {
  describe('defaultLoginAction', () => {
    it('has a type of DEFAULT_LOGIN_ACTION', () => {
      const expected = {
        type: DEFAULT_LOGIN_ACTION,
      };
      expect(defaultLoginAction()).toEqual(expected);
    });
  });
});

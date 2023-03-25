import { defineMessages } from 'react-intl';
import { LoginMessages } from '@benrevo/benrevo-react-core';

describe('Login messages', () => {
  it('defineMessages', () => {
    expect(typeof LoginMessages).toEqual('object');
  });
  const loginMessages = defineMessages({
    header: {
      id: 'app.containers.LoginPage.header',
      defaultMessage: 'This is LoginPage container !',
    },
  });
  it('defineMessages are loginMessages', () => {
    expect(LoginMessages).toEqual(loginMessages);
  });
});

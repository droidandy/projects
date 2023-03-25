import { containers } from 'testIDs';
import { admin } from '../users';

const Login = containers.Login;
const LOGIN_PAGE = Login.container;
const LOGIN_BUTTON = Login.loginButton;
const EMAIL_INPUT = Login.emailInput;
const PASSWORD_INPUT = Login.passwordInput;

export default async function login({ email = admin.email, password = admin.password } = admin) {
  await this.waitForVisible(LOGIN_PAGE);
  await this.expectForVisible(LOGIN_PAGE);
  this.t.pass('Should have Login screen');

  await this.enterInput(EMAIL_INPUT, email);

  await this.enterInput(PASSWORD_INPUT, password, true);

  await this.waitForClick(LOGIN_BUTTON, 5000);
}

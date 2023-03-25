import { containers } from 'testIDs';
import test from './utils/tape';
import { admin } from './users';

const { ForgotPassword, Login } = containers;

const FORGOT_PASSWORD_BUTTON = Login.forgotPassword;
const LOGIN_PAGE = Login.container;
const RESET_NOTIFICATION = Login.resetNotification;

const RESET_PASSWORD_DISABLED = ForgotPassword.resetPasswordDisabled;
const EMAIL_RESET = ForgotPassword.emailReset;
const RESET_PASSWORD = ForgotPassword.resetPassword;
const LOGIN_FROM_FORGOT = ForgotPassword.loginFromForgot;

const goToForgotPassword = async (t, driver) => {
  await driver.click(FORGOT_PASSWORD_BUTTON);
  t.pass('Should be visible Forgot Password screen');
};

const goToLoginPage = async (t, driver) => {
  await driver.expectForVisible(LOGIN_PAGE);
  t.pass('Should be visible Login screen');
};

test('Forgot password page', async (t, driver) => {
  await goToForgotPassword(t, driver);

  await driver.waitForVisible(RESET_PASSWORD_DISABLED, 5000);
  t.pass('Reset password button is disabled');

  await driver.waitForClick(EMAIL_RESET, 5000);
  await driver.setValue(EMAIL_RESET, admin.email);
  t.pass('Login was applied');
  await driver.toHaveText(EMAIL_RESET, admin.email, 'Email is correct');

  await driver.waitForClick(RESET_PASSWORD, 5000);
  t.pass('Reset button was clicked');
  await driver.waitForVisible(RESET_NOTIFICATION, 5000);
  t.pass('Reset notification is visible');

  await driver.waitForVisible(RESET_NOTIFICATION, 5000, false);
  t.pass('Reset notification was closed');

  await goToLoginPage(t, driver);
  await goToForgotPassword(t, driver);
  await driver.waitForClick(LOGIN_FROM_FORGOT, 5000);
  t.pass('Login button was clicked');
  await goToLoginPage(t, driver);
});

test('Forgot postcondition', async (t, driver) => {
  await driver.postcondition(LOGIN_PAGE, async () => {
    await goToLoginPage(t, driver);
  });
});

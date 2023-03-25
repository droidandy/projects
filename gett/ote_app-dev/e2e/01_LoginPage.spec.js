import { components, containers } from 'testIDs';
import test from './utils/tape';

import { caseInsensitiveEmail, invalidEmail, notExistUser, invalidPasswordUser } from './users';

const { Login, Settings, utils } = containers;
const LOGIN_PAGE = Login.container;
const LOGIN_ICON = Login.logoIcon;
const BG_IMAGE = Login.bgImage;
const FORGOT_PASSWORD_BUTTON = Login.forgotPassword;
const REGISTRATION_BUTTON = Login.registrationButton;

const SKIP_TOUCH_ID_LOGIN = components.TouchId.skip;

const EMAIL_INPUT = Login.emailInput;
const PASSWORD_INPUT = Login.passwordInput;
const EMAIL_CLEAR_BUTTON = Settings.SingleInputEditor.emailClearIcon;
const PASSWORD_CLEAR_BUTTON = Settings.SingleInputEditor.passwordClearIcon;
const LOGIN_BUTTON = Login.loginButton;
const LOGIN_BUTTON_DISABLED = `${Login.loginButton}${Login.disabled}`;


const TERMS_SWITCHER = `${utils.terms}/${utils.switcher}`;
const POLICY_SWITCHER = `${utils.policy}/${utils.switcher}`;
const TERMS_LINK = `${utils.terms}/${utils.link}`;
const POLICY_LINK = `${utils.policy}/${utils.link}`;
const TERMS_PAGE = 'termsConditions';
const POLICY_PAGE = 'privacyPolicy';
const TERMS_BACK_BUTTON = `${TERMS_PAGE}Back`;
const POLICY_BACK_BUTTON = `${POLICY_PAGE}Back`;

// UI tests

test('Login animation', async (t, driver) => {
  await driver.expectForExist(LOGIN_ICON);

  setTimeout(() => driver.takeScreenshot(driver.getPlatform(), 200));
  t.pass('screenshot was saved');
}, true);

test('Background image', async (t, driver) => {
  await driver.expectForExist(BG_IMAGE);
  await driver.expectForVisible(BG_IMAGE);

  t.pass('Background image is visible');
});

test('Forgot Password button', async (t, driver) => {
  await driver.expectForExist(FORGOT_PASSWORD_BUTTON);
  await driver.expectForVisible(FORGOT_PASSWORD_BUTTON);

  t.pass('Forgot Password button is visible');
});

test('Login button', async (t, driver) => {
  await driver.expectForExist(LOGIN_BUTTON);
  await driver.expectForVisible(LOGIN_BUTTON);

  t.pass('Login button is visible');
});

test('Enquire or open an account today link', async (t, driver) => {
  await driver.expectForExist(REGISTRATION_BUTTON);
  await driver.expectForVisible(REGISTRATION_BUTTON);

  t.pass('Registration button is visible');
});

// Email tests

test('Enter Correct Email/Password', async (t, driver) => {
  await driver.login();

  if (driver.getPlatform() === 'ios') {
    await driver.expectForExist(SKIP_TOUCH_ID_LOGIN);
    await driver.click(SKIP_TOUCH_ID_LOGIN);
  }

  await driver.checkDashboard(t);

  await driver.logout();
});

test('Enter Correct Written With Upper- And Lowercase Email', async (t, driver) => {
  await driver.login({ email: caseInsensitiveEmail });

  await driver.checkDashboard(t);

  await driver.logout();
});

test('Empty Email', async (t, driver) => {
  await driver.login({ email: '' });

  await driver.expectedVisibleErrorAlert(t, "Failed. Email can't be blank", 'Empty email error is visible');

  await driver.click(LOGIN_PAGE);
});

test('Wrong Email Format', async (t, driver) => {
  await driver.login({ email: invalidEmail });

  await driver.expectedVisibleErrorAlert(t, 'Failed. Email is invalid', 'Email format error is visible');

  await driver.click(LOGIN_PAGE);
});

test('Clear Email button', async (t, driver) => {
  await driver.expectForVisible(LOGIN_PAGE);
  t.pass('Should have Login screen');

  await driver.waitForClick(EMAIL_CLEAR_BUTTON, 5000);
  t.pass('Clear button tap');

  await driver.waitForClick(LOGIN_BUTTON, 5000);

  await driver.expectedVisibleErrorAlert(t, "Failed. Email can't be blank", 'Empty email error is visible');
});

// Password tests

test('Enter Less than 6 symbols', async (t, driver) => {
  await driver.login({ password: '12345' });

  await driver.expectedVisibleErrorAlert(t, 'Failed. Password must be at least 6 characters', 'Short password error is visible');

  await driver.click(LOGIN_PAGE);
});

test('Empty Password', async (t, driver) => {
  await driver.login({ password: '' });

  await driver.expectedVisibleErrorAlert(t, "Failed. Password can't be blank", 'Empty password error is visible');

  await driver.click(LOGIN_PAGE);
});

test('Wrong Email & Password', async (t, driver) => {
  await driver.login(notExistUser);

  await driver.expectedVisibleErrorAlert(t, 'Failed. The email or password you entered is incorrect.', 'Wrong password and email error is visible');

  await driver.click(LOGIN_PAGE);
});

test('Captcha Check (OMA-680)', async (t, driver) => {
  await driver.login(invalidPasswordUser);

  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);
  await driver.waitForClick(LOGIN_BUTTON, 5000);

  await driver.click(LOGIN_PAGE);

  await driver.login();

  await driver.logout();
});

test('Clear Password button', async (t, driver) => {
  await driver.waitForClick(PASSWORD_CLEAR_BUTTON, 5000);
  t.pass('Clear button tap');

  await driver.waitForClick(LOGIN_BUTTON, 5000);

  await driver.expectedVisibleErrorAlert(t, "Failed. Password can't be blank", 'Empty password error is visible');
});

// Switchers tests

test('Accept Terms and Conditions / Privacy Policy switchers', async (t, driver) => {
  await driver.clearInput(EMAIL_INPUT);
  await driver.clearInput(PASSWORD_INPUT);

  await driver.click(LOGIN_PAGE);

  t.pass('Inputs were cleared');

  await driver.click(TERMS_SWITCHER);
  await driver.click(POLICY_SWITCHER);

  t.pass('Form was cleared');

  await driver.click(TERMS_SWITCHER);
  await driver.click(POLICY_SWITCHER);

  t.pass('Terms and Conditions / Privacy Policy switchers were set');

  await driver.login();

  await driver.logout();
});

test('Link to Terms and conditions', async (t, driver) => {
  await driver.waitForClick(TERMS_LINK);

  await driver.expectForExist(TERMS_PAGE);
  await driver.expectForVisible(TERMS_PAGE);

  t.pass('Terms page was opened');

  await driver.click(TERMS_BACK_BUTTON);

  await driver.click(POLICY_LINK);

  await driver.expectForExist(POLICY_PAGE);
  await driver.expectForVisible(POLICY_PAGE);

  t.pass('Policies page was opened');

  await driver.click(POLICY_BACK_BUTTON);
});

test('Log in with disabled T&C enabled PP', async (t, driver) => {
  await driver.click(TERMS_SWITCHER);

  t.pass('Terms set unchecked');

  await driver.expectForExist(LOGIN_BUTTON_DISABLED);
  await driver.expectForVisible(LOGIN_BUTTON_DISABLED);

  t.pass('Login button is not clickable');

  await driver.click(TERMS_SWITCHER);

  t.pass('Terms set checked');
});

test('Log in with disabled T&C enabled PP', async (t, driver) => {
  await driver.click(POLICY_SWITCHER);

  t.pass('Policy set unchecked');

  await driver.expectForExist(LOGIN_BUTTON_DISABLED);
  await driver.expectForVisible(LOGIN_BUTTON_DISABLED);

  t.pass('Login button is not clickable');

  await driver.click(POLICY_SWITCHER);

  t.pass('Policy set checked');
});

test('Forgot postcondition', async (t, driver) => {
  await driver.postcondition(LOGIN_PAGE, async () => {
    await driver.logout();
  });
});

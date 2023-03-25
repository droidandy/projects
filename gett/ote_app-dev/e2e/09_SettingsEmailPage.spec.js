import { components, containers, navigators, utils } from 'testIDs';
import test from './utils/tape';
import { admin, caseInsensitiveEmail, existingEmail, invalidEmail } from './users';

const SCROLL_VIEW_SETTINGS = containers.Settings.scrollViewSettings;
const EMAIL_ID = containers.Settings.utils.profileEmail;
const EMAIL_VALUE = `${EMAIL_ID}/value`;
const EMAIL_INPUT = containers.Settings.SingleInputEditor.emailInput;
const SAVE_BUTTON = navigators.saveButton;
const EMAIL_CLEAR_BUTTON = containers.Settings.SingleInputEditor.emailClearIcon;
const BACK_BUTTON = components.BackButton;
const ALERT_BUTTON_NO = utils.alerts.confirmationResetBtn;
const ALERT_BUTTON_YES = utils.alerts.confirmationSubmitBtn;

const goToEditEmail = async (t, driver) => {
  await driver.click(EMAIL_ID);
  await driver.waitForVisible(EMAIL_INPUT);
  await driver.expectForVisible(EMAIL_INPUT);
  t.pass('Email input is visible');
};

test('Email Edit precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Settings Email Page: Enter Correct Email', async (t, driver) => {
  await driver.scrollTo(SCROLL_VIEW_SETTINGS, 'top');
  await driver.expectForVisible(EMAIL_ID);
  t.pass('Email menu is visible');

  await goToEditEmail(t, driver);
  await driver.enterInput(EMAIL_INPUT, admin.email);
  await driver.waitForClick(SAVE_BUTTON);
  t.pass('Save button was clicked');
  await driver.waitForVisible(EMAIL_ID);
  await driver.expectForExist(EMAIL_ID);
  t.pass('Email was saved');
});

test('Settings Email Page: Enter Correct Written With Upper- And Lowercase Email', async (t, driver) => {
  await goToEditEmail(t, driver);
  await driver.enterInput(EMAIL_INPUT, caseInsensitiveEmail, false, true);

  await driver.click(SAVE_BUTTON);
  await driver.waitForVisible(EMAIL_ID);
  await driver.expectForVisible(EMAIL_ID);
  t.pass('Email was saved');
});

test('Settings Email Page: Try to save empty Email', async (t, driver) => {
  await goToEditEmail(t, driver);
  await driver.clearInput(EMAIL_INPUT);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Email can\'t be blank', 'Email can\'t be blank');
});

test('Settings Email Page: Try to save invalid Email', async (t, driver) => {
  await driver.enterInput(EMAIL_INPUT, invalidEmail);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Email is invalid', 'Email is invalid');
});

test('Settings Email Page: Clear Email button', async (t, driver) => {
  await driver.click(EMAIL_CLEAR_BUTTON);
  await driver.toHaveText(EMAIL_INPUT, '', 'Email was cleared');
});

test('Settings Email Page: Try to save email which already exist', async (t, driver) => {
  await driver.enterInput(EMAIL_INPUT, existingEmail);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('This email is already registered', 'Can\'t save already registered email');
});

test('Settings Email Page: Valid Email, click "Back", "No" in modal', async (t, driver) => {
  await driver.enterInput(EMAIL_INPUT, admin.email);
  await driver.click(BACK_BUTTON);
  await driver.waitForVisible(ALERT_BUTTON_NO);
  await driver.expectForVisible(ALERT_BUTTON_NO);
  t.pass('No button on confirmation alert is visible');
  await driver.click(ALERT_BUTTON_NO);
  await driver.expectForVisible(ALERT_BUTTON_NO, true);
  t.pass('Confirmation alert was closed');
});

test('Settings Email Page: click "Back", "Yes" in modal', async (t, driver) => {
  await driver.click(BACK_BUTTON);
  await driver.waitForVisible(ALERT_BUTTON_YES);
  await driver.expectForVisible(ALERT_BUTTON_YES);
  t.pass('Yes button on confirmation alert is visible');
  await driver.click(ALERT_BUTTON_YES);
  await driver.expectForVisible(ALERT_BUTTON_YES, true);
  t.pass('Confirmation alert was closed');

  await driver.toHaveText(EMAIL_VALUE, caseInsensitiveEmail, 'Changes was reset');
});

test('Settings Email Page postcondition', async (t, driver) => {
  await driver.postcondition(SCROLL_VIEW_SETTINGS, async () => {
    await driver.click(BACK_BUTTON);

    await driver.expectForVisible(SCROLL_VIEW_SETTINGS);
  });
});

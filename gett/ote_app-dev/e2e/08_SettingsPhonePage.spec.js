import { components, containers, navigators, utils } from 'testIDs';
import test from './utils/tape';
import { userMocked } from './testData';

const SCROLL_VIEW_SETTINGS = containers.Settings.scrollViewSettings;
const PHONE_INPUT = containers.Settings.SingleInputEditor.phoneInput;
const SAVE_BUTTON = navigators.saveButton;
const BACK_BUTTON = components.BackButton;
const ALERT_BUTTON_NO = utils.alerts.confirmationResetBtn;
const ALERT_BUTTON_YES = utils.alerts.confirmationSubmitBtn;
const PHONE_NUMBER_VIEW = `${containers.Settings.Phones.phone}/${containers.Settings.Phones.numberView}`;
const MOBILE_NUMBER_VIEW = `${containers.Settings.Phones.mobile}/${containers.Settings.Phones.numberView}`;
const MOBILE_CHECKBOX_DISABLED = 'mobileCheckBox_disabled';
const MOBILE_CHECKBOX_ENABLED = 'mobileCheckBox_enabled';
const PHONE_CHECKBOX_DISABLED = 'phoneCheckBox_disabled';
const PHONE_CHECKBOX_ENABLED = 'phoneCheckBox_enabled';
const MOBILE_NUMBER = 'mobileNumber';

const SETTINGS_PROFILE_PHONE = containers.Settings.utils.profilePhone;

const PHONE_LIST = containers.Settings.Phones.list;
const SINGLE_INPUT_EDITOR = containers.Settings.SingleInputEditor.container;

test('Phone Edit precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Settings(Phone Page): Go to phone editing', async (t, driver) => {
  await driver.scrollTo(SCROLL_VIEW_SETTINGS, 'top');
  await driver.waitForClick(SETTINGS_PROFILE_PHONE);
  await driver.expectForVisible(PHONE_LIST);
  t.pass('Phone List is visible');

  await driver.waitForVisible(PHONE_NUMBER_VIEW);
  await driver.expectForVisible(PHONE_NUMBER_VIEW);
  t.pass('Phone number is visible');

  await driver.waitForClick(PHONE_NUMBER_VIEW);
  await driver.waitForVisible(SINGLE_INPUT_EDITOR);
  await driver.expectForExist(SINGLE_INPUT_EDITOR);
  t.pass('Phone Input is visible');
});

test('Settings(Phone Page): Try to save empty Phone number', async (t, driver) => {
  await driver.clearInput(PHONE_INPUT);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Phone can\'t be blank', 'Phone can\'t be blank');
});

test('Settings(Phone Page): Enter phone number <10 symbols', async (t, driver) => {
  await driver.setValue(PHONE_INPUT, 1234);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Phone number is too short', 'Phone number is too short');
});

test('Settings(Phone Page): Enter phone number >10 symbols', async (t, driver) => {
  await driver.clearInput(PHONE_INPUT);
  await driver.setValue(PHONE_INPUT, 111111111111);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Phone number is invalid', 'Phone number is invalid');
});

test('Settings(Phone Page): Click "Back", "No" in modal', async (t, driver) => {
  await driver.click(BACK_BUTTON);
  await driver.expectForVisible(ALERT_BUTTON_NO);
  t.pass('No button on confirmation alert is visible');
  await driver.click(ALERT_BUTTON_NO);
  await driver.expectForVisible(ALERT_BUTTON_NO, true);
  t.pass('Confirmation alert was closed');
});

test('Settings(Phone Page): Click "Back", "Yes" in modal', async (t, driver) => {
  await driver.click(BACK_BUTTON);
  await driver.expectForVisible(ALERT_BUTTON_YES);
  t.pass('Yes button on confirmation alert is visible');
  await driver.click(ALERT_BUTTON_YES);
  await driver.expectForVisible(ALERT_BUTTON_YES, true);
  t.pass('Confirmation alert was closed');
});

test('Settings(Phone Page): Save correct phone number', async (t, driver) => {
  await driver.waitForClick(PHONE_NUMBER_VIEW);
  await driver.clearInput(PHONE_INPUT);
  await driver.setValue(PHONE_INPUT, userMocked.phone);
  await driver.timeout(2000);
  await driver.toHaveText(PHONE_INPUT, `+${userMocked.phone}`, `${PHONE_INPUT} is correct`);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisible(PHONE_LIST);
  t.pass('Phone number was saved');
});

test('Settings(Phone Page): Go to mobile phone editing', async (t, driver) => {
  await driver.waitForVisible(MOBILE_NUMBER_VIEW);
  await driver.expectForVisible(MOBILE_NUMBER_VIEW);
  t.pass('Mobile number is visible');

  await driver.waitForClick(MOBILE_NUMBER_VIEW);
  await driver.waitForVisible(SINGLE_INPUT_EDITOR);
  await driver.expectForExist(SINGLE_INPUT_EDITOR);
  t.pass('Mobile Input is visible');
});

test('Settings(Phone Page): Save empty Mobile number', async (t, driver) => {
  await driver.clearInput(PHONE_INPUT);
  await driver.click(SAVE_BUTTON);
  t.pass('Save button was clicked');
  await driver.toHaveText(MOBILE_NUMBER, 'Add Another Phone', 'Empty mobile number was saved');
});

test('Settings(Phone Page): Enter mobile number <10 symbols', async (t, driver) => {
  await driver.click(MOBILE_NUMBER_VIEW);
  await driver.clearInput(PHONE_INPUT);
  await driver.setValue(PHONE_INPUT, 1234);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Phone number is too short', 'Mobile number is too short');
});

test('Settings(Phone Page): Enter mobile number >10 symbols', async (t, driver) => {
  await driver.clearInput(PHONE_INPUT);
  await driver.setValue(PHONE_INPUT, 111111111111);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisibleText('Phone number is invalid', 'Mobile number is invalid');
});

test('Settings(Phone Page): Save correct mobile number', async (t, driver) => {
  await driver.clearInput(PHONE_INPUT);
  await driver.setValue(PHONE_INPUT, userMocked.mobile);
  await driver.timeout(2000);
  await driver.toHaveText(PHONE_INPUT, `+${userMocked.mobile}`, `${PHONE_INPUT} is correct`);
  await driver.click(SAVE_BUTTON);
  await driver.expectForVisible(PHONE_LIST);
  await driver.toHaveText(MOBILE_NUMBER, `+${userMocked.mobile}`, 'Mobile number was saved');
});

test('Settings(Phone Page): Save as default mobile number', async (t, driver) => {
  await driver.click(MOBILE_CHECKBOX_DISABLED);
  await driver.waitForVisible(MOBILE_CHECKBOX_ENABLED);
  await driver.expectForVisible(MOBILE_CHECKBOX_DISABLED, true);
  await driver.expectForVisible(MOBILE_CHECKBOX_ENABLED);
  t.pass('Set as default mobile number');
});

test('Settings(Phone Page): Save as default phone number', async (t, driver) => {
  await driver.waitForClick(PHONE_CHECKBOX_DISABLED);
  await driver.waitForVisible(PHONE_CHECKBOX_ENABLED);
  await driver.expectForVisible(PHONE_CHECKBOX_DISABLED, true);
  await driver.expectForVisible(PHONE_CHECKBOX_ENABLED);
  t.pass('Set as default phone number');

  await driver.click(BACK_BUTTON);
});

test('Settings Phone Page postcondition', async (t, driver) => {
  await driver.postcondition(SCROLL_VIEW_SETTINGS, async () => {
    await driver.expectForVisible(BACK_BUTTON);
    await driver.click(BACK_BUTTON);

    await driver.expectForVisible(SCROLL_VIEW_SETTINGS);
  });
});

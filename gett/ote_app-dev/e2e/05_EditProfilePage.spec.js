import { containers, navigators, utils } from 'testIDs';
import test from './utils/tape';

const prepareName = ({ firstName = '', lastName = '' }) => `${firstName} ${lastName}`;

const mockData = {
  firstName: 'test',
  lastName: 'test'
};

const { EditProfile } = containers.Settings;
const SCROLL_VIEW_SETTINGS = containers.Settings.scrollViewSettings;
const { alerts } = utils;
const componentsUtils = containers.Settings.utils;

const EDIT_PROFILE = EditProfile.editProfile;
const AVATAR = EditProfile.avatar;
const FIRST_NAME_INPUT = EditProfile.firstName;
const FIRST_NAME_ERROR_LABEL = `${EditProfile.firstName}Error`;
const FIRST_NAME_CLEAR_ICON = EditProfile.clearFirstName;
const LAST_NAME_INPUT = EditProfile.lastName;
const LAST_NAME_ERROR_LABEL = `${EditProfile.lastName}Error`;
const LAST_NAME_CLEAR_ICON = EditProfile.clearLastName;
const BACK_BUTTON = navigators.profileBackButton;
const SAVE_BUTTON = navigators.profileSaveButton;

const ALERT_MODAL = alerts.confirmationAlert;
const ALERT_MODAL_CANCEL_BUTTON = alerts.confirmationResetBtn;
const ALERT_MODAL_ACCEPT_BUTTON = alerts.confirmationSubmitBtn;

const SETTINGS_AVATAR = componentsUtils.profileAvatar;
const SETTINGS_AVATAR_TITLE = `${SETTINGS_AVATAR}/title`;

const goToEditProfile = async (t, driver) => {
  await driver.click(SETTINGS_AVATAR);
  await driver.expectForVisible(EDIT_PROFILE);
  t.pass('Should have Edit Profile screen');
};

const checkItemsDisplay = async (t, driver) => {
  await driver.expectForVisible(FIRST_NAME_INPUT);
  t.pass('First name is visible');
  await driver.expectForVisible(LAST_NAME_INPUT);
  t.pass('Last name is visible');
  await driver.expectForVisible(AVATAR);
  t.pass('Avatar is visible');
};

const waitForAlertClick = async (t, driver, { item, message = '' }) => {
  await driver.waitForVisible(ALERT_MODAL);
  t.pass('Alert is visible');
  await driver.waitForClick(item, 5000);
  t.pass(message);
};

test('Edit Profile precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Edit Profile / Check basic conditions', async (t, driver) => {
  await driver.scrollTo(SCROLL_VIEW_SETTINGS, 'top');

  await goToEditProfile(t, driver);
  await checkItemsDisplay(t, driver);

  await driver.enterInput(FIRST_NAME_INPUT, mockData.firstName);
  await driver.enterInput(LAST_NAME_INPUT, mockData.lastName);
});

test('Edit Profile / Save empty fields', async (t, driver) => {
  await driver.waitForClick(FIRST_NAME_CLEAR_ICON, 5000);
  await driver.waitForClick(LAST_NAME_CLEAR_ICON, 5000);
  await driver.click(SAVE_BUTTON);

  await driver.toHaveText(FIRST_NAME_ERROR_LABEL, "First name can't be blank", 'First name error label is correct');
  await driver.toHaveText(LAST_NAME_ERROR_LABEL, "Last name can't be blank", 'Last name error label is correct');
  t.pass('Save empty fields');
});

test('Edit Profile / Enter valid first/Last name and click Save', async (t, driver) => {
  await driver.waitForClick(FIRST_NAME_INPUT, 5000);
  await driver.enterInput(FIRST_NAME_INPUT, mockData.firstName);

  await driver.waitForClick(LAST_NAME_INPUT, 5000);
  await driver.enterInput(LAST_NAME_INPUT, mockData.lastName);
  await driver.click(SAVE_BUTTON);
  t.pass('Enter valid First/Last name and click Save');

  await driver.toHaveText(SETTINGS_AVATAR_TITLE, prepareName(mockData), 'First/Last name is correct');
});

test('Edit Profile / Cancel alert modal', async (t, driver) => {
  await goToEditProfile(t, driver);
  await checkItemsDisplay(t, driver);

  await driver.enterInput(FIRST_NAME_INPUT, mockData.firstName);
  await driver.enterInput(LAST_NAME_INPUT, mockData.lastName);

  await driver.waitForClick(BACK_BUTTON, 5000);
  await waitForAlertClick(t, driver, { item: ALERT_MODAL_CANCEL_BUTTON, message: 'Alert was canceled' });
});

test('Edit Profile / Reset user changes', async (t, driver) => {
  await driver.waitForClick(BACK_BUTTON, 5000);
  await waitForAlertClick(t, driver, { item: ALERT_MODAL_ACCEPT_BUTTON, message: 'Reset user changes' });
});

test('Edit Profile postcondition', async (t, driver) => {
  await driver.postcondition(SETTINGS_AVATAR, async () => {
    await driver.expectForVisible(BACK_BUTTON);
    await driver.click(BACK_BUTTON);
  });
});

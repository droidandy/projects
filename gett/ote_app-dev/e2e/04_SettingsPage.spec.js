import { components, containers } from 'testIDs';
import test from './utils/tape';

const { Settings } = containers;
const SCROLL_VIEW_SETTINGS = Settings.scrollViewSettings;
const LOGOUT = Settings.logout;
const APP_VERSION = Settings.appVersion;

const { utils } = Settings;

const PROFILE_AVATAR = utils.profileAvatar;
const PROFILE_PHONE = utils.profilePhone;
const PROFILE_EMAIL = utils.profileEmail;
const PROFILE_CAR_TYPE = utils.profileCarType;

const ADDRESSES_HOME = utils.addressesHome;
const ADDRESSES_WORK = utils.addressesWork;
const ADDRESSES_MY_ADDRESSES = utils.addressesMyAddresses;

const SWITCHER_EMAIL = utils.switcherEmail;
const SWITCHER_SMS = utils.switcherSms;
const SWITCHER_PUSH = utils.switcherPush;
const SWITCHER_CALENDAR = utils.switcherCalendar;
const SWITCHER_WHEELCHAIR = utils.switcherWheelchair;
const SWITCHER_THEME = utils.switcherTheme;

const HISTORY_ORDERS = utils.historyOrders;
const HISTORY_STATISTICS = utils.historyStatistics;

const INFO_CONTACT_US = utils.infoContactUs;
const INFO_NOTIFICATIONS = utils.infoNotifications;
const INFO_PRIVACY = utils.infoPrivacyPolicy;
const INFO_TERMS = utils.infoTermsConditions;
const INFO_TUTORIAL = utils.infoTutorial;

const ANIMATION_CAR = utils.animationCar;
const ANIMATION_LOCATING = utils.animationLocating;
const MENU = components.BurgerButton;

test('Settings Page precondition', async (t, driver) => {
  await driver.dashboardPrecondition();
});

test('Settings list', async (t, driver) => {
  await driver.expectForVisible(MENU);
  await driver.click(MENU);

  await driver.expectForVisible(PROFILE_AVATAR);
  t.pass('Avatar is visible');
  await driver.expectForExist(components.Avatar);
  t.pass('Name and Last name are visible');
  await driver.expectForVisible(PROFILE_PHONE);
  t.pass('Phone menu is visible');
  await driver.expectForVisible(PROFILE_EMAIL);
  t.pass('Email menu is visible');
  await driver.expectForVisible(PROFILE_CAR_TYPE);
  t.pass('Default car type menu is visible');
  // TODO: get paymentsEnabled from api
  // await driver.expectForVisible('settings/profile/paymentCards);
  // t.pass('Payment Cards is visible');

  await driver.expectForVisible(ADDRESSES_HOME);
  t.pass('Home address menu is visible');
  await driver.expectForVisible(ADDRESSES_WORK);
  t.pass('Work address menu s visible');
  await driver.expectForVisible(ADDRESSES_MY_ADDRESSES);
  t.pass('My addresses menu is visible');

  await driver.scroll(SCROLL_VIEW_SETTINGS, 450, 'down');
  await driver.expectForVisible(SWITCHER_EMAIL);
  t.pass('Email switcher is visible');
  await driver.expectForVisible(SWITCHER_SMS);
  t.pass('SMS switcher is visible');
  await driver.expectForVisible(SWITCHER_PUSH);
  t.pass('Push switcher is visible');
  await driver.expectForVisible(SWITCHER_CALENDAR);
  t.pass('Calendar switcher is visible');
  await driver.expectForVisible(SWITCHER_WHEELCHAIR);
  t.pass('Wheelchair switcher is visible');
  await driver.expectForVisible(SWITCHER_THEME);
  t.pass('Color theme menu is visible');

  await driver.scroll(SCROLL_VIEW_SETTINGS, 400, 'down');
  await driver.expectForVisible(HISTORY_ORDERS);
  t.pass('Orders menu is visible');
  await driver.expectForVisible(HISTORY_STATISTICS);
  t.pass('Statistics menu is visible');

  await driver.expectForVisible(INFO_TUTORIAL);
  t.pass('Watch Tutorial menu is visible');
  await driver.expectForVisible(INFO_PRIVACY);
  t.pass('Private Policy menu is visible');
  await driver.expectForVisible(INFO_TERMS);
  t.pass('Terms Conditions menu is visible');
  await driver.expectForVisible(INFO_NOTIFICATIONS);
  t.pass('Notification History menu is visible');
  await driver.expectForVisible(INFO_CONTACT_US);
  t.pass('Contact Us menu is visible');

  await driver.scrollTo(SCROLL_VIEW_SETTINGS, 'bottom');
  await driver.expectForVisible(ANIMATION_CAR);
  t.pass('Car animations switcher is visible');
  await driver.expectForVisible(ANIMATION_LOCATING);
  t.pass('Locating animations switcher is visible');

  await driver.expectForVisible(LOGOUT);
  t.pass('Log Out button is visible');
  await driver.expectForVisible(APP_VERSION);
  t.pass('App version is visible');
});

test('Settings Page postcondition', async (t, driver) => {
  await driver.postcondition(SCROLL_VIEW_SETTINGS, async () => {
    await driver.expectForVisible(MENU);
    await driver.click(MENU);
  });
});

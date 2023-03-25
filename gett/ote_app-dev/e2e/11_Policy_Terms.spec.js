import { containers } from 'testIDs';
import test from './utils/tape';

const MAP_PAGE = containers.Map.map;

const SCROLL_VIEW_SETTINGS = containers.Settings.scrollViewSettings;
const PRIVACY_POLICY = containers.Settings.utils.infoPrivacyPolicy;
const TERMS_CONDITIONS = containers.Settings.utils.infoTermsConditions;
const PRIVACY_POLICY_PAGE = 'privacyPolicy';
const TERMS_CONDITIONS_PAGE = 'termsConditions';
const CONTACT_US = containers.Settings.utils.infoContactUs;
const PRIVACY_BACK = `${PRIVACY_POLICY_PAGE}Back`;
const TERMS_BACK = `${TERMS_CONDITIONS_PAGE}Back`;
const CLOSE_SETTINGS = containers.Settings.closeSettings;

test('Policies/Terms Page precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Privacy Policy', async (t, driver) => {
  await driver.scrollTo(SCROLL_VIEW_SETTINGS, 'top');
  await driver.scroll(SCROLL_VIEW_SETTINGS, 950, 'down');

  await driver.waitForVisible(PRIVACY_POLICY);
  await driver.expectForVisible(PRIVACY_POLICY);
  t.pass('Private Policy menu is visible');

  await driver.click(PRIVACY_POLICY);
  t.pass('Privacy menu was clicked');

  await driver.waitForVisible(PRIVACY_POLICY_PAGE);
  await driver.expectForVisible(PRIVACY_POLICY_PAGE);
  t.pass('Privacy Policy page is visible');

  await driver.waitForVisible(PRIVACY_BACK);
  await driver.expectForVisible(PRIVACY_BACK);
  t.pass('Privacy Policy Back button is visible');

  await driver.click(PRIVACY_BACK);
  t.pass('Back button was clicked');

  await driver.waitForVisible(PRIVACY_POLICY);
  await driver.expectForVisible(PRIVACY_POLICY);
  t.pass('Private Policy menu is visible');
});

test('Terms and Conditions', async (t, driver) => {
  await driver.waitForVisible(TERMS_CONDITIONS);
  await driver.expectForVisible(TERMS_CONDITIONS);
  t.pass('Terms Conditions menu is visible');

  await driver.click(TERMS_CONDITIONS);
  t.pass('Terms and Conditions menu was clicked');

  await driver.waitForVisible(TERMS_CONDITIONS_PAGE);
  await driver.expectForVisible(TERMS_CONDITIONS_PAGE);
  t.pass('Terms and Conditions page is visible');

  await driver.waitForVisible(TERMS_BACK);
  await driver.expectForVisible(TERMS_BACK);
  t.pass('Terms and Conditions Back button is visible');

  await driver.click(TERMS_BACK);
  t.pass('Back button was clicked');

  await driver.waitForVisible(TERMS_CONDITIONS);
  await driver.expectForVisible(TERMS_CONDITIONS);
  t.pass('Terms and Conditions menu is visible');
});

test('Contact Us', async (t, driver) => {
  await driver.waitForVisible(CONTACT_US);
  await driver.expectForVisible(CONTACT_US);
  t.pass('Contact Us menu is visible');
  t.pass('Contact Us page can\'t be tested on emulator');

  await driver.waitForVisible(CLOSE_SETTINGS);
  await driver.expectForVisible(CLOSE_SETTINGS);
  t.pass('Close Settings button is visible');

  await driver.click(CLOSE_SETTINGS);
  t.pass('Close button was clicked');
});

test('Settings Payment page postcondition', async (t, driver) => {
  await driver.postcondition(MAP_PAGE, async () => {
    await driver.click(CLOSE_SETTINGS);

    await driver.expectForVisible(MAP_PAGE);
  });
});

import { components, containers, navigators, utils } from 'testIDs';
import test from './utils/tape';
import { userMocked, addresses } from './testData';

const { AddressModal } = components;

const ADDRESS_MODAL = AddressModal.container;
const ADDRESS_MODAL_PIN = AddressModal.pin;
const ADDRESS_MODAL_CLOSE = `${AddressModal.container}/close`;
const ADD_ADDRESS_BUTTON = containers.Settings.addAddressButton;
const EDITOR_ADDRESS = containers.Settings.AddressEditor.address;
const ADDRESS_INPUT = AddressModal.input;
const ADDRESSES_LIST = AddressModal.list;
const FIRST_ADDRESS_IN_LIST = `${ADDRESSES_LIST}[0]`;
const EDITOR_BACK_BUTTON = containers.Settings.AddressEditor.backBtn;
const CONFIRMATION_SUBMIT_BUTTON = utils.alerts.confirmationSubmitBtn;

const FAVOURITE_HOME = 'homeFavourite';
const REMOVAL_SUBMIT_BUTTON = utils.alerts.removalSubmitBtn;

const PIN_SCENE = containers.PickupAddressScene.container;
const PIN_SCENE_BACK = containers.PickupAddressScene.back;
const PIN_SCENE_ADDRESS = containers.PickupAddressScene.address;
const PIN_SCENE_SUBMIT = containers.PickupAddressScene.submit;

const ADDRESSES_LIST_BACK = navigators.addressesListBack;

const SETTINGS_PAGE_SCROLL = containers.Settings.scrollViewSettings;
const FAVOURITE_ADDRESSES = containers.Settings.utils.addressesMyAddresses;

async function clearAddressBySwipe(t, driver, { selector }) {
  await driver.expectForVisible(selector);
  await driver.swipe(selector, 'left', 'slow', 0.3);

  t.pass('Swipe element was dragged');

  await driver.expectForVisible(`${selector}Delete`);
  await driver.click(`${selector}Delete`);

  t.pass('Confirmation modal was opened');

  await driver.click(REMOVAL_SUBMIT_BUTTON);

  t.pass('Address was cleared');
}

async function setNewAddress(t, driver) {
  await driver.expectForVisible(FAVOURITE_HOME);
  await driver.click(FAVOURITE_HOME);
  await driver.expectForVisible(ADDRESS_MODAL);

  t.pass('Address modal was opened');

  await driver.expectForVisible(ADDRESS_MODAL_PIN);
  await driver.click(ADDRESS_MODAL_PIN);
  await driver.expectForVisible(PIN_SCENE);

  t.pass('Pin scene was opened');

  await driver.swipe(PIN_SCENE, 'down', 'slow', 0.22);

  t.pass('Address was changed');

  await driver.expectForVisible(PIN_SCENE_SUBMIT);
  await driver.click(PIN_SCENE_SUBMIT);

  t.pass('Press submit button');
}

async function toHaveNoText(t, driver, selector, addressName) {
  try {
    await driver.toHaveText(selector, addressName, 'Address was not changed');
    t.fail('Address wasn\'t changed');
  } catch {
    t.pass('Address was updated');
  }
}

test('Adresses Pin Edit precondition', async (t, driver) => {
  await driver.settingsPrecondition();

  await driver.addressesPrecondition();
});

test('Change address to unsupported', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await driver.expectForVisible(FAVOURITE_ADDRESSES);
    await driver.click(FAVOURITE_ADDRESSES);

    await driver.expectForVisible(ADD_ADDRESS_BUTTON);
    await driver.click(ADD_ADDRESS_BUTTON);

    t.pass('Start creating new favourite address');

    await driver.expectForVisible(EDITOR_ADDRESS);
    await driver.click(EDITOR_ADDRESS);

    await driver.expectForVisible(ADDRESS_MODAL);

    t.pass('Address modal was opened');

    await driver.expectForVisible(ADDRESS_INPUT);
    await driver.enterInput(ADDRESS_INPUT, '1 High St, Cromer NR27 0AB, UK', true);
    await driver.click(FIRST_ADDRESS_IN_LIST);

    await driver.click(EDITOR_ADDRESS);

    await driver.expectForVisible(ADDRESS_MODAL_PIN);
    await driver.click(ADDRESS_MODAL_PIN);
    await driver.expectForVisible(PIN_SCENE);

    t.pass('Pin scene was opened');

    await driver.swipe(PIN_SCENE, 'left', 'slow', 0.9);

    t.pass('Map was shifted');

    await driver.timeout(300);

    await driver.expectForVisible(PIN_SCENE_ADDRESS);
    await driver.toHaveText(PIN_SCENE_ADDRESS, 'Not supported address', 'Address is not supported');
    await driver.expectForVisible(`${PIN_SCENE_SUBMIT}Disabled`);

    t.pass("Address can't be set");

    await driver.expectForVisible(PIN_SCENE_BACK);
    await driver.click(PIN_SCENE_BACK);

    await driver.expectForVisible(ADDRESS_MODAL);
    await driver.expectForVisible(ADDRESS_MODAL_CLOSE);
    await driver.click(ADDRESS_MODAL_CLOSE);

    await driver.expectForVisible(EDITOR_BACK_BUTTON);
    await driver.click(EDITOR_BACK_BUTTON);

    await driver.expectForVisible(CONFIRMATION_SUBMIT_BUTTON);
    await driver.click(CONFIRMATION_SUBMIT_BUTTON);
  } else {
    t.pass('Not supported for current platform');
  }
});

test('Return from editing without changes', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await driver.expectForVisible(FAVOURITE_HOME);
    await driver.click(FAVOURITE_HOME);

    await driver.expectForVisible(ADDRESS_MODAL);

    t.pass('Address modal was opened');

    await driver.expectForVisible(ADDRESS_MODAL_PIN);
    await driver.click(ADDRESS_MODAL_PIN);
    await driver.expectForVisible(PIN_SCENE);
    t.pass('Pin scene was opened');

    await driver.expectForVisible(PIN_SCENE_BACK);
    await driver.click(PIN_SCENE_BACK);

    t.pass('Press back button');

    await driver.expectForVisible(ADDRESS_MODAL);
    await driver.expectForVisible(ADDRESS_MODAL_CLOSE);
    await driver.click(ADDRESS_MODAL_CLOSE);

    t.pass('Address modal was closed');

    await driver.expectForVisible(FAVOURITE_HOME);
    await driver.expectForVisible(`${FAVOURITE_HOME}/value`);
    await driver.toHaveText(`${FAVOURITE_HOME}/value`, addresses.london.cityAirport.name, 'Address was not changed');
  } else {
    t.pass('Not supported for current platform');
  }
});

test('Save new address after pin change', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await setNewAddress(t, driver);

    await driver.expectForVisible(FAVOURITE_HOME);
    await driver.expectForVisible(`${FAVOURITE_HOME}/value`);

    await toHaveNoText(t, driver, `${FAVOURITE_HOME}/value`, addresses.london.cityAirport.name);
  } else {
    t.pass('Not supported for current platform');
  }
});

test('Open empty address', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await clearAddressBySwipe(t, driver, { selector: FAVOURITE_HOME });

    await driver.expectForVisible(FAVOURITE_HOME);
    await driver.click(FAVOURITE_HOME);
    await driver.expectForVisible(ADDRESS_MODAL);

    t.pass('Address modal was opened');

    await driver.expectForVisible(ADDRESS_MODAL_PIN);
    await driver.click(ADDRESS_MODAL_PIN);
    await driver.expectForVisible(PIN_SCENE);

    t.pass('Pin scene was opened');

    await driver.expectForVisible(PIN_SCENE_ADDRESS);
    await driver.toHaveText(PIN_SCENE_ADDRESS, userMocked.companyAddress, 'Current position address was set');

    await driver.expectForVisible(PIN_SCENE_BACK);
    await driver.click(PIN_SCENE_BACK);

    t.pass('Press back button');

    await driver.expectForVisible(ADDRESS_MODAL);
    await driver.expectForVisible(ADDRESS_MODAL_CLOSE);
    await driver.click(ADDRESS_MODAL_CLOSE);

    t.pass('Address modal was closed');
  } else {
    t.pass('Not supported for current platform');
  }
});

test('Open empty address', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await setNewAddress(t, driver);

    await driver.expectForVisible(FAVOURITE_HOME);
    await driver.expectForVisible(`${FAVOURITE_HOME}/value`);

    await toHaveNoText(t, driver, `${FAVOURITE_HOME}/value`, '');
  } else {
    t.pass('Not supported for current platform');
  }

  await driver.expectForVisible(ADDRESSES_LIST_BACK);
  await driver.click(ADDRESSES_LIST_BACK);

  t.pass('Return to Settings list');
});

test('Address Pin postcondition', async (t, driver) => {
  await driver.postcondition(SETTINGS_PAGE_SCROLL, async () => {
    await driver.expectForVisible(ADDRESSES_LIST_BACK);
    await driver.click(ADDRESSES_LIST_BACK);

    await driver.expectForVisible(SETTINGS_PAGE_SCROLL);
  });
});

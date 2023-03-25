import { containers, navigators, utils } from 'testIDs';
import test from './utils/tape';
import { addresses } from './testData';

const SETTINGS_PAGE_SCROLL = containers.Settings.scrollViewSettings;
const HOME_ADDRESS = containers.Settings.utils.addressesHome;
const WORK_ADDRESS = containers.Settings.utils.addressesWork;
const FAVOURITE_ADDRESSES = containers.Settings.utils.addressesMyAddresses;
const BACK_BUTTON = navigators.addressesListBack;

const FAVOURITE_HOME = 'homeFavourite';
const FAVOURITE_WORK = 'workFavourite';
const REMOVAL_SUBMIT_BUTTON = utils.alerts.removalSubmitBtn;
const CONFIRMATION_SUBMIT_BUTTON = utils.alerts.confirmationSubmitBtn;
const ADD_ADDRESS_BUTTON = containers.Settings.addAddressButton;

const SAVE_FAVOURITE = navigators.addressSave;
const EDITOR_FORM = containers.Settings.AddressEditor.form;
const EDITOR_NAME = containers.Settings.AddressEditor.name;
const EDITOR_ADDRESS = containers.Settings.AddressEditor.address;
const EDITOR_PICKUP_MSG = containers.Settings.AddressEditor.pickupMsg;
const EDITOR_DESTINATION_MSG = containers.Settings.AddressEditor.destinationMsg;
const EDITOR_BACK_BUTTON = containers.Settings.AddressEditor.backBtn;

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

test('Adresses Edit precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Move to Settings', async (t, driver) => {
  await driver.expectForVisible(SETTINGS_PAGE_SCROLL);
  await driver.scrollTo(SETTINGS_PAGE_SCROLL, 'top');

  t.pass('Settings page is visible');

  await driver.scroll(SETTINGS_PAGE_SCROLL, 250, 'down');
});

test('Home address - Select suggested address', async (t, driver) => {
  await driver.selectAddress({ selector: HOME_ADDRESS, address: addresses.london.cityAirport });
});

test('Home address - Close modal without editing', async (t, driver) => {
  await driver.openModalWithoutEditing({ selector: HOME_ADDRESS, address: addresses.london.cityAirport });
});

test('Work address - Select suggested address', async (t, driver) => {
  await driver.selectAddress({ selector: WORK_ADDRESS, address: addresses.london.waterloo });
});

test('Work address - Close modal without editing', async (t, driver) => {
  await driver.openModalWithoutEditing({ selector: WORK_ADDRESS, address: addresses.london.waterloo });
});

test('Clear addresses', async (t, driver) => {
  await driver.expectForVisible(FAVOURITE_ADDRESSES);
  await driver.click(FAVOURITE_ADDRESSES);

  t.pass('Favourites addresses were opened');

  await clearAddressBySwipe(t, driver, { selector: FAVOURITE_HOME });

  await clearAddressBySwipe(t, driver, { selector: FAVOURITE_WORK });

  try {
    await clearAddressBySwipe(t, driver, { selector: '0Favourite' });
  } catch {
    t.pass('No favourite address to remove');
  }
  // TODO: delete all
});

test('Add home address', async (t, driver) => {
  await driver.selectAddress({ selector: FAVOURITE_HOME, address: addresses.london.cityAirport });
});

test('Add work address', async (t, driver) => {
  await driver.selectAddress({ selector: FAVOURITE_WORK, address: addresses.london.waterloo });
});

test('Favourite - Save empty fields', async (t, driver) => {
  await driver.expectForVisible(ADD_ADDRESS_BUTTON);
  await driver.click(ADD_ADDRESS_BUTTON);

  t.pass('Start creating new favourite address');

  await driver.expectForVisible(`${SAVE_FAVOURITE}Disabled`);

  t.pass('Save button is disabled with empty fields');
});

test('Favourite - All fields are correct and save address', async (t, driver) => {
  await driver.expectForVisible(EDITOR_NAME);
  await driver.enterInput(EDITOR_NAME, 'Test');
  await driver.click(EDITOR_FORM);
  await driver.swipe(EDITOR_FORM, 'down', 'fast', 0.1);

  t.pass('Name of favourite address was set');

  await driver.selectAddress({ selector: EDITOR_ADDRESS, address: addresses.london.theSavoy, skipCheck: true });
  await driver.expectForVisible(EDITOR_ADDRESS);
  await driver.toHaveText(EDITOR_ADDRESS, addresses.london.theSavoy.name, 'Address was set');

  await driver.expectForVisible(EDITOR_PICKUP_MSG);
  await driver.enterInput(EDITOR_PICKUP_MSG, 'Test');
  await driver.click(EDITOR_FORM);
  await driver.swipe(EDITOR_FORM, 'down', 'fast', 0.1);

  t.pass('Pickup message was set');

  await driver.expectForVisible(EDITOR_DESTINATION_MSG);
  await driver.enterInput(EDITOR_DESTINATION_MSG, 'Test');
  await driver.click(EDITOR_FORM);
  await driver.swipe(EDITOR_FORM, 'down', 'fast', 0.1);

  t.pass('Destination message was set');

  await driver.expectForVisible(SAVE_FAVOURITE);
  await driver.click(SAVE_FAVOURITE);

  t.pass('New address was saved');

  await driver.expectForVisible('0Favourite');
  await driver.expectForVisible('0Favourite/value');
  await driver.toHaveText('0Favourite/value', addresses.london.theSavoy.name, 'Address is available in list');
});

test('Favourite - Duplicated Address Name', async (t, driver) => {
  await driver.expectForVisible(ADD_ADDRESS_BUTTON);
  await driver.click(ADD_ADDRESS_BUTTON);

  t.pass('Start creating new favourite address');

  await driver.expectForVisible(EDITOR_NAME);
  await driver.enterInput(EDITOR_NAME, 'Test');
  await driver.click(EDITOR_FORM);
  await driver.swipe(EDITOR_FORM, 'down', 'fast', 0.1);

  t.pass('Name of favourite address was set');

  await driver.selectAddress({ selector: EDITOR_ADDRESS, address: addresses.london.waterloo, skipCheck: true });
  await driver.expectForVisible(EDITOR_ADDRESS);
  await driver.toHaveText(EDITOR_ADDRESS, addresses.london.waterloo.name, 'Address was set');

  await driver.expectForVisible(SAVE_FAVOURITE);
  await driver.click(SAVE_FAVOURITE);

  await driver.expectForVisible(`${EDITOR_NAME}Error`);
  await driver.toHaveText(`${EDITOR_NAME}Error`, 'is already taken', 'Name taken error was shown');

  await driver.expectForVisible(EDITOR_BACK_BUTTON);
  await driver.click(EDITOR_BACK_BUTTON);

  await driver.expectForVisible(CONFIRMATION_SUBMIT_BUTTON);
  await driver.click(CONFIRMATION_SUBMIT_BUTTON);
});

test('Address Settings postcondition', async (t, driver) => {
  await driver.postcondition(SETTINGS_PAGE_SCROLL, async () => {
    await driver.expectForVisible(BACK_BUTTON);
    await driver.click(BACK_BUTTON);

    await driver.expectForVisible(SETTINGS_PAGE_SCROLL);
  });
});

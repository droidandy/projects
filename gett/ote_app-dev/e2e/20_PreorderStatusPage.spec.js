import { components, containers } from 'testIDs';
import test from './utils/tape';

import { addresses } from './testData';

const { Settings, Map, Orders } = containers;

const MAP_PAGE = Map.map;
const MENU = components.BurgerButton;

const CLOSE_SETTINGS = Settings.closeSettings;

const ORDERS_BUTTON = Orders.mainButton;
const ORDERS_BACK_BUTTON = Orders.backButton;

const SETTINGS_HOME_ADDRESS = Settings.utils.addressesHome;
const SETTINGS_WORK_ADDRESS = Settings.utils.addressesWork;

const HOME_ADDRESS = Orders.homeAddress;
const WORK_ADDRESS = Orders.workAddress;

const PICK_UP_ADDRESS = `${Orders.preOrder}/pickupAddress`;
const DESTINATION_ADDRESS = `${Orders.preOrder}/destinationAddress`;

const ORDER_CREATING_BACK = Orders.creatingBack;

const LOCATION_SERVICE_RESET = Orders.serviceResetBtn;

const MY_LOCATION = Orders.myLocationBtn;

const expectButtonCheck = async (t, driver, { btn, backBtn, message = 'Back to map screen' }) => {
  await driver.expectForVisible(btn);
  t.pass(`${btn} is visible`);
  await driver.click(btn);
  t.pass(`Press ${btn}`);
  await driver.waitForClick(backBtn, 5000);
  await driver.checkForVisible({ selector: MAP_PAGE });
  t.pass(message);
};

const fillAddress = async (t, driver, { selector, address }) => {
  await driver.checkForVisible({ selector: MENU });
  await driver.click(MENU);
  t.pass('Open Settings');
  await driver.selectAddress({ selector, address });
  await driver.waitForClick(CLOSE_SETTINGS);
  t.pass('Close Settings');
};

const checkVisibleAddress = async (t, driver, { selector, fillSelector, address = addresses.london.cityAirport }) => {
  try {
    await driver.checkForVisible({ selector });
    t.pass(`${selector} is visible`);
  } catch (err) {
    t.pass(`${selector} is not present`);
    await fillAddress(t, driver, { selector: fillSelector, address });
    await driver.checkForVisible({ selector });
    t.pass(`${selector} is visible`);
  }
};

test('Preorder Page precondition', async (t, driver) => {
  await driver.dashboardPrecondition();
});

test('Favourite addresses buttons', async (t, driver) => {
  await driver.expectForVisible(MAP_PAGE);

  await checkVisibleAddress(t, driver, { selector: HOME_ADDRESS, fillSelector: SETTINGS_HOME_ADDRESS, address: addresses.london.cityAirport });

  await checkVisibleAddress(t, driver, { selector: WORK_ADDRESS, fillSelector: SETTINGS_WORK_ADDRESS, address: addresses.london.waterloo });
});

test('Orders button', async (t, driver) => {
  await expectButtonCheck(t, driver, { btn: ORDERS_BUTTON, backBtn: ORDERS_BACK_BUTTON });
});

test('Pick up address - Select suggested address', async (t, driver) => {
  await driver.checkForVisible({ selector: PICK_UP_ADDRESS });
  t.pass('Pick up address is visible');
  await driver.selectAddress({ selector: PICK_UP_ADDRESS, address: addresses.london.cityAirport });
});

test('Pick up address - Close modal without editing', async (t, driver) => {
  await driver.openModalWithoutEditing({ selector: PICK_UP_ADDRESS, address: addresses.london.cityAirport });
});

test('Destination address - Select suggested address', async (t, driver) => {
  await driver.checkForVisible({ selector: DESTINATION_ADDRESS });
  t.pass('Destination address is visible');
  await driver.selectAddress({ selector: DESTINATION_ADDRESS, address: addresses.london.waterloo });
});

test('Destination address - Close modal without editing', async (t, driver) => {
  await driver.checkForVisible({ selector: DESTINATION_ADDRESS });
  t.pass('Destination address is visible');
  await driver.openModalWithoutEditing({ selector: DESTINATION_ADDRESS, address: addresses.london.waterloo });
});

test('Close Promo banner if exist', async (t, driver) => {
  await driver.waitForInteractionWithPromo({});
});

test('Reset order', async (t, driver) => {
  await driver.waitForOrderReset();
});

test('Location service popup dismiss', async (t, driver) => {
  await expectButtonCheck(t, driver, { btn: MY_LOCATION, backBtn: LOCATION_SERVICE_RESET, message: 'Location service popup dismiss' });
});

test('Burger button', async (t, driver) => {
  await expectButtonCheck(t, driver, { btn: MENU, backBtn: CLOSE_SETTINGS });
});

test('Preorder page postcondition', async (t, driver) => {
  await driver.postcondition(MENU, async () => {
    await driver.click(ORDER_CREATING_BACK);

    await driver.expectForVisible(MENU);
  });
});

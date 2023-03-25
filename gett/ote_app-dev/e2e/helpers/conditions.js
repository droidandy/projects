import { components, containers } from 'testIDs';
import { admin } from '../users';
import { addresses } from '../testData';

const MENU = components.BurgerButton;
const { Settings } = containers;
const SETTINGS_PAGE_SCROLL = Settings.scrollViewSettings;
const FAVOURITE_ADDRESSES = containers.Settings.utils.addressesMyAddresses;
const FAVOURITE_HOME = 'homeFavourite';
const FAVOURITE_BACK_BUTTON = 'addressesListBack';

const SKIP_TOUCH_ID_LOGIN = components.TouchId.skip;
const MODAL_TOUCH_ID_LOGIN = components.TouchId.modal;

const TEST_EMAIL = admin.email;

export async function settingsPrecondition(expectedId = SETTINGS_PAGE_SCROLL) {
  try {
    await this.expectForVisible(expectedId);
    this.t.pass('Settings page is visible');
  } catch {
    await this.login(TEST_EMAIL);

    if (this.getPlatform() === 'ios') {
      await this.waitForVisible(MODAL_TOUCH_ID_LOGIN);
      await this.expectForVisible(MODAL_TOUCH_ID_LOGIN);
      this.t.pass('Should have touch id modal');

      await this.expectForExist(SKIP_TOUCH_ID_LOGIN);
      await this.click(SKIP_TOUCH_ID_LOGIN);
      this.t.pass('Skip touch id');
    }

    this.t.pass('Logged in');

    await this.expectForVisible(MENU);
    await this.click(MENU);

    await this.expectForVisible(expectedId);
  }
}

export async function dashboardPrecondition() {
  try {
    await this.waitForVisible(MENU);
    await this.expectForVisible(MENU);
    this.t.pass('Menu is visible');
  } catch {
    await this.login(TEST_EMAIL);


    if (this.getPlatform() === 'ios') {
      await this.waitForVisible(MODAL_TOUCH_ID_LOGIN);
      await this.expectForVisible(MODAL_TOUCH_ID_LOGIN);
      this.t.pass('Should have touch id modal');

      await this.expectForExist(SKIP_TOUCH_ID_LOGIN);
      await this.click(SKIP_TOUCH_ID_LOGIN);
      this.t.pass('Skip touch id');
    }

    this.t.pass('Logged in');

    await this.waitForVisible(MENU);
    await this.expectForVisible(MENU);
  }
}

export async function addressValidation(address, selector) {
  try {
    await this.expectForVisible(selector);
    await this.toHaveText(selector, address.name, 'Required address is set');
  } catch {
    await this.selectAddress({ selector, address });
  }
}

export async function addressesPrecondition() {
  await this.expectForVisible(FAVOURITE_ADDRESSES);
  await this.click(FAVOURITE_ADDRESSES);

  await this.addressValidation(addresses.london.cityAirport, FAVOURITE_HOME);

  await this.expectForVisible(FAVOURITE_BACK_BUTTON);
  await this.click(FAVOURITE_BACK_BUTTON);
}

export async function postcondition(expectedId = MENU, onConditionFailed) {
  try {
    await this.expectForVisible(expectedId);
    this.t.pass(`${MENU} is visible`);
  } catch {
    await onConditionFailed();
  }
}

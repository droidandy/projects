import { components, containers } from 'testIDs';

const LOGIN_PAGE = containers.Login.container;
const SETTINGS_BUTTON = components.BurgerButton;
const SETTINGS_PAGE = containers.Settings.scrollViewSettings;
const LOGOUT_BUTTON = containers.Settings.logout;

export default async function logout() {
  await this.waitForVisible(SETTINGS_BUTTON);
  await this.expectForVisible(SETTINGS_BUTTON);
  this.t.pass('Settings button is visible');

  await this.click(SETTINGS_BUTTON);

  // Sometimes click by Burger button doesn't open Setting Page.
  try {
    await this.expectForVisible(SETTINGS_PAGE);
    this.t.pass('Settings page is visible');
  } catch (e) {
    await this.click(SETTINGS_BUTTON);
    await this.expectForVisible(SETTINGS_PAGE);
    this.t.pass('Settings page is visible');
  }

  await this.scrollTo(SETTINGS_PAGE, 'bottom');
  await this.waitForClick(LOGOUT_BUTTON, 5000);

  this.t.pass('Logout button was clicked');

  await this.expectForVisible(LOGIN_PAGE);

  this.t.pass('Login page is visible');
}

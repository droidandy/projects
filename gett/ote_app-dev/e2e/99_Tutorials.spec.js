import { components, containers } from 'testIDs';
import test from './utils/tape';
import { newUser } from './users';

const NEXT_BUTTON = containers.UserGuide.nextButton;
const SKIP_BUTTON = containers.UserGuide.skipButton;
const FINISH_BUTTON = containers.UserGuide.finishButton;
const SETTINGS_BUTTON = components.BurgerButton;

const asyncLoop = async (type, arr, t, driver) => {
  // eslint-disable-next-line
  for (const key of arr) {
    const hole = `${type}/hole/${key}`;
    await driver.waitForVisible(hole);
    await driver.expectForVisible(hole);
    t.pass(`${key} ${type} hole is visible`);

    const step = `${type}/step/${key}`;
    await driver.waitForVisible(step);
    await driver.expectForVisible(step);
    t.pass(`${key} ${type} step is visible`);
  }
};

test('Tutorials precondition', async (t, driver) => {
  await driver.dashboardPrecondition();
});

test('Tutorials: login', async (t, driver) => {
  await driver.logout();
  await driver.login(newUser);
});

test('Tutorials: Map Tutorial', async (t, driver) => {
  await driver.disableSynchronization();

  await driver.waitForVisible(SETTINGS_BUTTON);
  t.pass('Map is visible');

  await asyncLoop('map', [1, 2, 3], t, driver);

  // Skip button
  await driver.waitForVisible(SKIP_BUTTON);
  await driver.expectForVisible(SKIP_BUTTON);
  t.pass('Skip button is visible');

  // Next button
  await driver.waitForVisible(NEXT_BUTTON);
  await driver.expectForVisible(NEXT_BUTTON);
  t.pass('Next button is visible');

  // https://github.com/wix/Detox/issues/971
  if (driver.getPlatform() === 'ios') {
    await driver.click(NEXT_BUTTON);
    t.pass('Next button was clicked');
  } else {
    t.pass('Can not be tested on Android');
  }
});

test('Tutorials: Orders Tutorial', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await asyncLoop('orders', [1, 2], t, driver);

    // Skip button
    await driver.waitForVisible(SKIP_BUTTON);
    await driver.expectForVisible(SKIP_BUTTON);
    t.pass('Skip button is visible');

    // Next button
    await driver.waitForVisible(NEXT_BUTTON);
    await driver.expectForVisible(NEXT_BUTTON);
    t.pass('Next button is visible');

    await driver.click(NEXT_BUTTON);
    t.pass('Next button was clicked');
  } else {
    t.pass('Can not be tested on Android');
  }
});

test('Tutorials: Settings Tutorial', async (t, driver) => {
  if (driver.getPlatform() === 'ios') {
    await asyncLoop('settings', [1, 2, 3], t, driver);

    await driver.waitForVisible(FINISH_BUTTON);
    await driver.expectForVisible(FINISH_BUTTON);
    t.pass('Finish button is visible');
  } else {
    t.pass('Can not be tested on Android');
  }
});

test('Tutorials: Terminate app', async (t, driver) => {
  await driver.enableSynchronization();
  await driver.terminateApp();

  t.pass('Terminate app');
});

import test from './utils/tape';
import { admin } from './users';

const MENU = 'menu';

test('Enquire page', async (t) => {
  t.pass('Enquire page');
});

test('Enquire postcondition', async (t, driver) => {
  await driver.postcondition(MENU, async () => {
    await driver.login(admin.email);
  });
});

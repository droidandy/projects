import { containers, utils } from 'testIDs';

const { Orders, Promo } = containers;

const PROMO = Promo.view;
const PROMO_CLOSE = Promo.close;

const ORDER_CREATING_BACK = Orders.creatingBack;
const CONFIRMATION_SUBMIT = utils.alerts.confirmationSubmitBtn;
const CONFIRMATION_ALERT = utils.alerts.confirmationAlert;

export async function checkForVisible({ selector, shouldBeHidden = false }) {
  await this.waitForVisible(selector, 5000, shouldBeHidden);
  await this.expectForVisible(selector, shouldBeHidden);
}

export async function waitForInteractionWithPromo({ actionSelector = PROMO_CLOSE }) {
  try {
    await this.waitForVisible(PROMO);
    await this.expectForVisible(PROMO);
    this.t.pass('Promo is visible');
    await this.click(actionSelector);
    this.t.pass(`Press ${actionSelector}`);
    await this.waitForVisible(PROMO, 5000, true);
    await this.expectForVisible(PROMO, true);
    this.t.pass('Promo was hide');
  } catch {
    this.t.pass('Promo banner did not appear');
  }
}

export async function waitForOrderReset() {
  await this.waitForInteractionWithPromo({});
  await this.waitForClick(ORDER_CREATING_BACK);
  await this.waitForVisible(CONFIRMATION_ALERT);
  await this.expectForVisible(CONFIRMATION_ALERT);
  this.t.pass(`${CONFIRMATION_ALERT} is visible`);
  await this.waitForClick(CONFIRMATION_SUBMIT, 5000);
  await this.waitForVisible(CONFIRMATION_ALERT, 5000, true);
  await this.expectForVisible(CONFIRMATION_ALERT, true);
  this.t.pass(`${CONFIRMATION_ALERT} was hide`);
  this.t.pass('Order was reset');
}

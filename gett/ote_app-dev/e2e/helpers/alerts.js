import { containers, utils } from 'testIDs';

const { Login } = containers;
const LOGIN_ERROR_ALERT = Login.loginErrorAlert;
const LOGIN_ERROR_ALERT_MESSAGE = `${Login.loginErrorAlert}/${utils.alerts.message}`;

export default async function expectedVisibleErrorAlert(t, alert, message) {
  await this.expectForExist(LOGIN_ERROR_ALERT);
  await this.waitForVisible(LOGIN_ERROR_ALERT, 5000);
  await this.expectForVisible(LOGIN_ERROR_ALERT);
  t.pass('Alert was shown');

  await this.toHaveText(LOGIN_ERROR_ALERT_MESSAGE, alert, message);
}

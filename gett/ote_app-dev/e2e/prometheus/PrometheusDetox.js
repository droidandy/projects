import detox from 'detox';
import Prometheus from './Prometheus';

export default class PrometheusDetox extends Prometheus {
  expectForExist = async selector => (
    await expect(element(by.id(selector))).toExist()
  );

  expectForVisible = (selector, shouldBeHidden = false) => (
    shouldBeHidden
      ? expect(element(by.id(selector))).toBeNotVisible()
      : expect(element(by.id(selector))).toBeVisible()
  );

  expectForVisibleText = async (text, message) => {
    await expect(element(by.text(text))).toBeVisible();
    return this.t.pass(message);
  };

  waitForVisible = (selector, timeout = 5000, shouldBeHidden = false) => (
    shouldBeHidden
      ? waitFor(element(by.id(selector))).toBeNotVisible().withTimeout(timeout)
      : waitFor(element(by.id(selector))).toBeVisible().withTimeout(timeout)
  );

  waitForClick = async (selector, timeout) => {
    await this.waitForVisible(selector, timeout);
    await this.click(selector);
  };

  waitForClickText = async (text, timeout = 5000) => {
    await waitFor(element(by.text(text)).atIndex(0)).toBeVisible().withTimeout(timeout);
    await element(by.text(text)).atIndex(0).tap();
  };

  waitForClickLabel = async (label, timeout) => {
    await waitFor(element(by.label(label))).toBeVisible().withTimeout(timeout);
    await element(by.label(label)).tap();
  };

  click = async (selector) => {
    try {
      await element(by.id(selector)).atIndex(1).tap();
    } catch (error) {
      await element(by.id(selector)).atIndex(0).tap();
    }
  };

  toHaveText = async (selector, expectedValue, message) => {
    await expect(element(by.id(selector))).toHaveText(`${expectedValue}`);
    return this.t.pass(message);
  };

  toHaveValue = async (selector, expectedValue, message) => {
    await expect(element(by.id(selector))).toHaveValue(expectedValue);
    return this.t.pass(message);
  };

  replaceValue = async (selector, value, clickDoneButton) => {
    await this.setValue(selector, value, clickDoneButton, false, true);
  }

  setValue = async (selector, value, clickDoneButton, typeSlow, replace) => {
    const enterMethod = replace ? 'replaceText' : 'typeText';
    const platform = this.getPlatform();
    const isNotASimpleInput = clickDoneButton === 'numeric' || clickDoneButton === 'textarea';

    if (platform === 'android' || (platform === 'ios' && value)) {
      const typeText = text => element(by.id(selector))[enterMethod](text);
      const lineBreak = clickDoneButton && !isNotASimpleInput ? '\n' : '';

      if (typeSlow) {
        const inputValue = value.split('').concat(lineBreak).filter(Boolean);

        for (const word of inputValue) {
          await typeText(word);
        }
      } else {
        await typeText(`${value}${lineBreak}`);
      }
    }

    if (isNotASimpleInput) {
      await this.clickDoneButton('numericKeyboard');
    }
  };

  clearText = async selector => (
    await element(by.id(selector)).clearText()
  );

  swipe = async (selector, direction, speed, percentage) => element(by.id(selector)).swipe(direction, speed, percentage);

  scroll = async (selector, pixels, direction) => (
    await element(by.id(selector)).scroll(pixels, direction)
  );

  scrollTo = async (selector, edge) => (
    await element(by.id(selector)).scrollTo(edge)
  );

  launchApp = params => device.launchApp(params);

  getPlatform = () => device.getPlatform();

  cleanup = () => detox.cleanup();

  disableSynchronization = () => device.disableSynchronization();

  enableSynchronization = () => device.enableSynchronization();

  terminateApp = () => device.terminateApp();
}

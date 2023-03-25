import { components, containers, navigators, utils } from 'testIDs';
import moment from 'moment-timezone';
import test from './utils/tape';
import { userMocked } from './testData';

const { Settings } = containers;
const SCROLL_VIEW_SETTINGS = Settings.scrollViewSettings;

const PAYMENT_CARDS_MENU = containers.Settings.utils.profilePaymentCards;

const { PaymentCards } = containers;
const PAYMENT_CARDS_LIST = PaymentCards.list;
const PAYMENT_CARD_FIRST = `${PaymentCards.card}[0]`;
const PAYMENT_CARD_SECOND = `${PaymentCards.card}[1]`;
const ADD_PAYMENT_BTN = PaymentCards.addButton;
const PAYMENT_CARD_EDITOR = PaymentCards.editor;

const CARD_TYPES = PaymentCards.cardTypes;
const PERSONAL = 'personal';
const BUSINESS = 'business';
const ALERT_MODAL = utils.alerts.confirmationAlert;

// Labels
const CARD_TYPE_LABEL = PaymentCards.label.cardType;

// Texts
const CARD_TYPE_TEXT = CARD_TYPE_LABEL.replace('label', 'text');

// Inputs
const CARD_NUMBER_INPUT = PaymentCards.input.cardNumber;
const EXPIRATION_DATE_INPUT = PaymentCards.input.expirationDate;
const CVV_INPUT = PaymentCards.input.cvv;
const CARD_HOLDER_INPUT = PaymentCards.input.cardHolder;

// buttons
const SAVE_BUTTON = navigators.savePaymentBtn;
const SAVE_BUTTON_DISABLED = `${SAVE_BUTTON}Disabled`;
const BACK_BUTTON = components.BackButton;
const ALERT_BUTTON_NO = utils.alerts.confirmationResetBtn;
const ALERT_BUTTON_YES = utils.alerts.confirmationSubmitBtn;
const EXPIRATION_HELP_BUTTON = PaymentCards.help.expirationDate;
const CVV_HELP_BUTTON = PaymentCards.help.cvv;
const REMOVE_SUBMIT_BUTTON = utils.alerts.removalSubmitBtn;

const DEACTIVATE_BUTTON = PaymentCards.deactivate;

// Modals
const REMOVAL_ALERT = utils.alerts.removalAlert;
const MODAL_EXPIRATION_DATE = 'modal/expirationDate';
const MODAL_CVV = 'modal/cvv';
const MODAL_EXPIRATION_DATE_CLOSE = 'modal/expirationDate/close';
const MODAL_CVV_CLOSE = 'modal/cvv/close';

const date = new Date();

const toNotVisibleText = async (t, driver, value, message) => {
  try {
    await driver.expectForVisibleText(value);
    t.fail('Text shouldn\'t be visible');
  } catch {
    t.pass(message);
  }
};

const createPaymentCard = async (t, driver) => {
  await driver.click(ADD_PAYMENT_BTN);
  t.pass('Add button was clicked');
  try {
    await driver.waitForVisible(SAVE_BUTTON_DISABLED);
    await driver.expectForVisible(SAVE_BUTTON_DISABLED);
    t.pass('Add Credit card is visible');
  } catch (e) {
    await driver.click(ADD_PAYMENT_BTN);
  }

  await driver.enterInput(CARD_NUMBER_INPUT, userMocked.cardNumber);

  const fullDate = `${moment().add(1, 'y').format('MMYYYY')}`;

  await driver.clearText(EXPIRATION_DATE_INPUT);
  await driver.setValue(EXPIRATION_DATE_INPUT, fullDate);

  await driver.enterInput(CVV_INPUT, '123');

  await driver.enterInput(CARD_HOLDER_INPUT, 'John Smith');

  await driver.click(SAVE_BUTTON);

  await driver.waitForVisible(PAYMENT_CARDS_LIST);
  await driver.expectForVisible(PAYMENT_CARDS_LIST);
  t.pass('Payment cards list is visible, payment card was saved');
};

test('Payments precondition', async (t, driver) => {
  await driver.settingsPrecondition();
});

test('Settings Payment Cards Page: Card list', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.waitForClick(PAYMENT_CARDS_MENU, 5000);
    t.pass('Payment Cards menu was clicked');
    await driver.waitForVisible(PAYMENT_CARDS_LIST);
    t.pass('Payment cards list is visible');
  });
});

test('Set default first payment card as default', async (t, driver) => {
  await driver.testOnIOS(async () => {
    try {
      await driver.waitForVisible(PAYMENT_CARD_FIRST);
      await driver.expectForVisible(PAYMENT_CARD_FIRST);
      t.pass('First payment card is visible');
    } catch (e) {
      await createPaymentCard(t, driver);
      await driver.waitForVisible(PAYMENT_CARD_FIRST);
      await driver.expectForVisible(PAYMENT_CARD_FIRST);
      t.pass('First payment card is visible');
    }

    try {
      await driver.click('checkbox[0]_disabled');
      t.pass('Set default first payment card as default');
    } catch (e) {
      t.pass('First payment card already default');
    }

    await element(by.id(PAYMENT_CARD_FIRST).withDescendant(by.id('checkbox[0]_disabled')));
    t.pass('First default payment card is correctly');
  });
});

test('Settings Payment Cards Page: Remove Payment Cards', async (t, driver) => {
  await driver.testOnIOS(async () => {
    let exist = true;
    let i = 1;

    /* eslint-disable no-await-in-loop */
    while (exist) {
      try {
        await driver.waitForVisible(PAYMENT_CARD_SECOND);
        await driver.expectForVisible(PAYMENT_CARD_SECOND);
        t.pass(`[${i}] Payment card is visible`);
      } catch (e) {
        exist = false;
        t.pass('Only one payment card exist');
      }

      if (exist) {
        await driver.swipe(PAYMENT_CARD_SECOND, 'left');

        await driver.waitForVisible(DEACTIVATE_BUTTON);
        await driver.expectForVisible(DEACTIVATE_BUTTON);
        t.pass(`[${i}] Deactivate button is visible`);

        await driver.click(DEACTIVATE_BUTTON);
        t.pass(`[${i}] Deactivate button was clicked`);

        await driver.waitForVisible(REMOVAL_ALERT);
        await driver.expectForVisible(REMOVAL_ALERT);
        t.pass(`[${i}] Removal alert is visible`);

        await driver.waitForVisible(REMOVE_SUBMIT_BUTTON);
        await driver.expectForVisible(REMOVE_SUBMIT_BUTTON);
        t.pass(`[${i}] Removal button is visible`);

        await driver.click(REMOVE_SUBMIT_BUTTON);

        i += 1;
      }
    }
  });
});

test('Settings Payment Cards Page: Try to remove Payment card if exist only 1', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.waitForVisible(PAYMENT_CARD_FIRST);
    await driver.expectForVisible(PAYMENT_CARD_FIRST);
    t.pass('First Payment card is visible');

    await driver.swipe(PAYMENT_CARD_FIRST, 'left');

    await driver.waitForVisible(DEACTIVATE_BUTTON, 5000, true);
    await driver.expectForVisible(DEACTIVATE_BUTTON, true);
    t.pass('Last payment card can\'t be removed');
  });
});

test('Settings Payment Cards Page: Add new card (Personal/Business)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.click(ADD_PAYMENT_BTN);
    t.pass('Add button was clicked');
    await driver.waitForVisible(PAYMENT_CARD_EDITOR);
    t.pass('Payment Card Editor is visible');

    // Personal Card Type
    await driver.waitForClick(CARD_TYPE_LABEL);
    t.pass('Change card type was clicked');
    await driver.waitForVisible(CARD_TYPES);
    t.pass('Card types is visible');

    await driver.click(PERSONAL);
    await driver.waitForVisible(PAYMENT_CARD_EDITOR);
    t.pass('Payment Card Editor is visible');
    await driver.toHaveText(CARD_TYPE_TEXT, 'Personal', 'Personal card type applied correctly');

    // Business Card Type
    await driver.waitForClick(CARD_TYPE_LABEL);
    t.pass('Change card type was clicked');
    await driver.waitForVisible(CARD_TYPES);
    t.pass('Card types is visible');

    await driver.click(BUSINESS);
    await driver.waitForVisible(PAYMENT_CARD_EDITOR);
    t.pass('Payment Card Editor is visible');
    await driver.toHaveText(CARD_TYPE_TEXT, 'Business', 'Business card type applied correctly');
  });
});

test('Settings Payment Cards Page: Add new card (Card number <12 symbols)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.enterInput(CARD_NUMBER_INPUT, '12345678901');
    await driver.click(SAVE_BUTTON);
    await driver.expectForVisibleText('Card number must be 13-19 numbers', 'Can\'t apply card number <12');
  });
});

test('Settings Payment Cards Page: Add new card (Valid card number >=12 symbols)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.enterInput(CARD_NUMBER_INPUT, userMocked.cardNumber);
    await driver.click(SAVE_BUTTON);
    await toNotVisibleText(t, driver, 'Card number must be 13-19 numbers', 'Card number is correct');
  });
});

test('Settings Payment Cards Page: Add new card (Expiration year < 4 digits)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.setValue(EXPIRATION_DATE_INPUT, '11201');
    await driver.click(SAVE_BUTTON);
    await driver.expectForVisibleText('Expiration year must be 4 numbers', 'Can\'t apply year <4 numbers');
  });
});

test('Settings Payment Cards Page: Add new card (Expiration month > 12)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.clearText(EXPIRATION_DATE_INPUT);
    await driver.setValue(EXPIRATION_DATE_INPUT, '13201');
    await driver.click(SAVE_BUTTON);
    await driver.expectForVisibleText(
      'Expiration month must be less than or equal to 12',
      'Can\'t apply expiration month > 12'
    );
  });
});

test('Settings Payment Cards Page: Add new card (Expiration date earlier then current month)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    const fullDate = `03${date.getFullYear() - 1}`;
    await driver.clearText(EXPIRATION_DATE_INPUT);
    await driver.setValue(EXPIRATION_DATE_INPUT, fullDate);
    await driver.click(SAVE_BUTTON);
    await driver.expectForVisibleText('Expiration date is expired', 'Can\'t apply expired date');
  });
});

test('Settings Payment Cards Page: Add new card (Valid expiration date)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    const fullDate = `03${date.getFullYear() + 1}`;
    await driver.clearText(EXPIRATION_DATE_INPUT);
    await driver.setValue(EXPIRATION_DATE_INPUT, fullDate);
    await driver.click(SAVE_BUTTON);
    await toNotVisibleText(t, driver, 'Expiration date is expired', 'Expiration date is valid');
  });
});

test('Settings Payment Cards Page: Add new card (Empty CVV)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.expectForVisibleText('CVV is invalid', 'Can\'t apply empty CVV');
  });
});

test('Settings Payment Cards Page: Add new card (CVV < 3 digits)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.enterInput(CVV_INPUT, '12');
    await driver.click(SAVE_BUTTON);
    await driver.expectForVisibleText('CVV must be 3-4 numbers', 'Can\'t apply CVV < 3 digits');
  });
});

test('Settings Payment Cards Page: Add new card (Valid CVV)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.enterInput(CVV_INPUT, userMocked.cvv);
    await driver.click(SAVE_BUTTON);
    await toNotVisibleText(t, driver, 'CVV must be 3-4 numbers', 'Apply valid CVV');
  });
});

test('Settings Payment Cards Page: Add new card (Empty cardholder)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.swipe(PAYMENT_CARD_EDITOR, 'up');
    await driver.expectForVisibleText('Holder name is invalid', 'Can\'t apply empty Cardholder');
  });
});

test('Settings Payment Cards Page: Add new card (Valid Cardholder name)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.enterInput(CARD_HOLDER_INPUT, 'John Smith');
  });
});

test('Settings Payment Cards Page: Add new card (Question button Expiration date)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.click(EXPIRATION_HELP_BUTTON);
    t.pass('Expiration help button was clicked');

    await driver.waitForVisible(MODAL_EXPIRATION_DATE);
    await driver.expectForVisible(MODAL_EXPIRATION_DATE);
    t.pass('Expiration modal is visible');

    await driver.click(MODAL_EXPIRATION_DATE_CLOSE);
    t.pass('Close modal button was clicked');

    await driver.waitForVisible(MODAL_EXPIRATION_DATE, 5000, true);
    await driver.expectForVisible(MODAL_EXPIRATION_DATE, true);
    t.pass('Expiration modal was closed');
  });
});

test('Settings Payment Cards Page: Add new card (Question button CVV)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.click(CVV_HELP_BUTTON);
    t.pass('CVV help button was clicked');

    await driver.waitForVisible(MODAL_CVV);
    await driver.expectForVisible(MODAL_CVV);
    t.pass('CVV modal is visible');

    await driver.click(MODAL_CVV_CLOSE);
    t.pass('Close modal button was clicked');

    await driver.waitForVisible(MODAL_CVV, 5000, true);
    await driver.expectForVisible(MODAL_CVV, true);
    t.pass('CVV modal was closed');
  });
});

test('Settings Payment Cards Page: Add new card (click "Back", "No" in modal)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.click(BACK_BUTTON);
    t.pass('Back button was clicked');

    await driver.waitForVisible(ALERT_MODAL);
    await driver.expectForVisible(ALERT_MODAL);
    t.pass('Alert modal is visible');

    await driver.click(ALERT_BUTTON_NO);
    t.pass('No button was clicked');

    await driver.waitForVisible(ALERT_MODAL, 5000, true);
    await driver.expectForVisible(ALERT_MODAL, true);
    t.pass('Alert modal was closed');
  });
});

test('Settings Payment Cards Page: Add new card (click "Back", "Yes" in modal)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await driver.click(BACK_BUTTON);
    t.pass('Back button was clicked');

    await driver.waitForVisible(ALERT_MODAL);
    await driver.expectForVisible(ALERT_MODAL);
    t.pass('Alert modal is visible');

    await driver.click(ALERT_BUTTON_YES);
    t.pass('No button was clicked');

    await driver.waitForVisible(ALERT_MODAL, 5000, true);
    await driver.expectForVisible(ALERT_MODAL, true);
    t.pass('Alert modal was closed');

    await driver.waitForVisible(PAYMENT_CARDS_LIST);
    t.pass('Payment cards list is visible');
  });
});

test('Settings Payment Cards Page: Add new card (Correct card)', async (t, driver) => {
  await driver.testOnIOS(async () => {
    await createPaymentCard(t, driver);

    // Go to Settings page
    await driver.click(BACK_BUTTON);
  });
});

test('Settings Payment page postcondition', async (t, driver) => {
  await driver.postcondition(SCROLL_VIEW_SETTINGS, async () => {
    await driver.click(BACK_BUTTON);

    await driver.expectForVisible(SCROLL_VIEW_SETTINGS);
  });
});

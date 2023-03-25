import { components, containers, utils } from 'testIDs';
import test from './utils/tape';
import { addresses, flightNumbers, label, currencySymbol } from './testData';

const { Orders, Promo, ModalWithContent, StopPointsModal, SearchModal, FlightSettings, PaymentCards } = containers;

const MENU = components.BurgerButton;

const PICK_UP_ADDRESS = `${Orders.preOrder}/${Orders.pickupAddress}`;
const DESTINATION_ADDRESS = `${Orders.preOrder}/${Orders.destinationAddress}`;
const ADD_STOP_ADDRESS = `${Orders.preOrder}/${Orders.addStopAddress}`;

const ORDER_DETAILS_PICK_UP_ADDRESS = `${Orders.editOrderDetails}/${Orders.pickupAddress}`;
const ORDER_DETAILS_DESTINATION_ADDRESS = `${Orders.editOrderDetails}/${Orders.destinationAddress}`;
const ORDER_DETAILS_ADD_STOP_ADDRESS = `${Orders.editOrderDetails}/${Orders.addStopAddress}`;

const ADD_STOP_BUTTON = StopPointsModal.addStopBtn;
const STOP_POINTS_MODAL = StopPointsModal.view;
const STOP_POINTS_MODAL_CLOSE = StopPointsModal.close;
const FIRST_STOP_POINT_CLOSE_IN_LIST = `${StopPointsModal.list}[0]/close`;

const PROMO_SELECT = Promo.select;

const BACK_BUTTON = components.BackButton;
const ORDER_CREATING_BACK = Orders.creatingBack;

const NEXT_BUTTON = Orders.nextBtn;
const EDIT_ORDER_DETAILS = Orders.scrollViewEditOrderDetails;

const MODAL_WITH_CONTENT = ModalWithContent.view;
const MODAL_WITH_CONTENT_CLOSE = ModalWithContent.close;

const SEARCH_INPUT = SearchModal.input;
const SEARCH_LIST = SearchModal.list;
const FIRST_SEARCH_IN_LIST = `${SEARCH_LIST}[0]`;

const PAYMENT_LIST = PaymentCards.list;
const FIRST_PAYMENT_IN_LIST = `${PaymentCards.card}[0]`;

const ORDER_FOR_ITEM = utils.options.orderFor;
const MESSAGE_FOR_DRIVER_ITEM = utils.options.messageForDriver;
const TRIP_REASON_ITEM = utils.options.tripReason;
const PAYMENT_METHOD_ITEM = utils.options.paymentMethod;
const FLIGHT_NUMBER_ITEM = utils.options.flightNumber;

const FLIGHT_MODAL_INPUT = FlightSettings.input;
const FLIGHT_VERIFY_BUTTON = FlightSettings.verifyBtn;
const FLIGHT_SAVE_BUTTON = FlightSettings.saveBtn;

const fillOrderParam = async (t, driver, { text, selector = SEARCH_INPUT }) => {
  await driver.checkForVisible({ selector: MODAL_WITH_CONTENT });
  t.pass('Modal was opened');

  await driver.checkForVisible({ selector });
  await driver.enterInput(selector, text);
  t.pass('Search was filled');
  await driver.waitForClick(MODAL_WITH_CONTENT_CLOSE);
  await driver.checkForVisible({ selector: MODAL_WITH_CONTENT, shouldBeHidden: true });
  t.pass('Modal was hide');
};

const searchItem = async (t, driver, { search }) => {
  await driver.checkForVisible({ selector: MODAL_WITH_CONTENT });
  t.pass('Modal was opened');

  await driver.enterInput(SEARCH_INPUT, search);

  await driver.click(MODAL_WITH_CONTENT);
  t.pass('Search was filled');
};

const selectSearchItem = async (t, driver, { search, searchLabel, selector }) => {
  await searchItem(t, driver, { search });

  await driver[driver.getPlatform() === 'ios' ? 'expectForVisible' : 'waitForVisible'](SEARCH_LIST);
  await driver.expectForVisible(FIRST_SEARCH_IN_LIST);

  t.pass('search list was loaded');

  await driver.click(FIRST_SEARCH_IN_LIST);

  await driver.expectForVisible(selector);
  await driver.expectForVisible(`${selector}/value`);
  t.pass(`${selector}/value is visible`);
  await driver.toHaveText(`${selector}/value`, searchLabel, 'Сorrectly set value');
};

const waitForAddressSelection = async (t, driver, { selector, address, skipCheck = false }) => {
  await driver.checkForVisible({ selector });
  t.pass(`${selector} is visible`);
  await driver.selectAddress({ selector, address, skipCheck });
};

const addressesPreOrder = async (t, driver, {
  pickupSelector = PICK_UP_ADDRESS,
  pickupAddress = addresses.london.cityAirport,
  destinationSelector = DESTINATION_ADDRESS,
  destinationAddress = addresses.london.waterloo
}) => {
  await waitForAddressSelection(t, driver, { selector: pickupSelector, address: pickupAddress });
  await waitForAddressSelection(t, driver, { selector: destinationSelector, address: destinationAddress });
};

const expectAddStopPoint = async (t, driver, { selector, address = addresses.london.cityAirport }) => {
  await driver.waitForClick(selector);
  await driver.checkForVisible({ selector: STOP_POINTS_MODAL });
  t.pass('Stop points modal is visible');
  await waitForAddressSelection(t, driver, { selector: ADD_STOP_BUTTON, address, skipCheck: true });
};

const addMaximumStopPoints = async (t, driver, { selector = ADD_STOP_ADDRESS }) => {
  await driver.selectAddress({ selector, address: addresses.london.waterloo, skipCheck: true });
  await expectAddStopPoint(t, driver, { selector, address: addresses.london.bigBen });
  await expectAddStopPoint(t, driver, { selector, address: addresses.london.eye });
  await expectAddStopPoint(t, driver, { selector, address: addresses.london.theO2 });
  await expectAddStopPoint(t, driver, { selector, address: addresses.london.heathrowAirport });

  await driver.waitForClick(selector);
  await driver.checkForVisible({ selector: STOP_POINTS_MODAL });
  t.pass('Stop points modal is visible');
  await driver.checkForVisible({ selector: ADD_STOP_BUTTON, shouldBeHidden: true });
  t.pass('added maximum number of stop points');
};

const deleteFirstStopPoint = async (t, driver) => {
  await driver.waitForClick(FIRST_STOP_POINT_CLOSE_IN_LIST);
  t.pass('delete first in list stop point');

  await driver.click(STOP_POINTS_MODAL_CLOSE);
  await driver.checkForVisible({ selector: STOP_POINTS_MODAL, shouldBeHidden: true });
  t.pass('Stop points modal was hide');
};

const checkCurrency = async (t, driver, { carSelector = 'Standard', localCurrencySymbol = null }) => {
  await driver.timeout(2000);
  await driver.checkForVisible({ selector: carSelector });
  t.pass(`${carSelector} is visible`);
  await driver.checkForVisible({ selector: `${carSelector}/${utils.currencySymbol}` });
  t.pass(`${carSelector}/${utils.currencySymbol} is visible`);
  await driver.toHaveText(`${carSelector}/${utils.currencySymbol}`, currencySymbol.GBP, 'The currency symbol is displayed correctly.');

  if (localCurrencySymbol) {
    await driver.checkForVisible({ selector: `${carSelector}/${utils.localCurrencySymbol}` });
    t.pass(`${carSelector}/${utils.localCurrencySymbol} is visible`);
    await driver.toHaveText(`${carSelector}/${utils.localCurrencySymbol}`, localCurrencySymbol, 'The local currency symbol is displayed correctly.');
  }
};

test('Preorder Page precondition', async (t, driver) => {
  await driver.dashboardPrecondition();
});

test('Select pickup and destination', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
});

test('Close yellow banner', async (t, driver) => {
  await driver.waitForInteractionWithPromo({});
});

test('Change pickup', async (t, driver) => {
  await waitForAddressSelection(t, driver, { selector: PICK_UP_ADDRESS, address: addresses.london.theSavoy });
});

test('Change destination', async (t, driver) => {
  await waitForAddressSelection(t, driver, { selector: DESTINATION_ADDRESS, address: addresses.london.waterloo });
});

test('PreOrder was reset', async (t, driver) => {
  await driver.waitForOrderReset();
});

test('Click on yellow banner', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForInteractionWithPromo({ actionSelector: PROMO_SELECT });
});

test('Add stop points', async (t, driver) => {
  await addMaximumStopPoints(t, driver, {});
});

test('Delete stop point', async (t, driver) => {
  await deleteFirstStopPoint(t, driver);
  await driver.waitForOrderReset();
});

test('Select 2 addresses in UK', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
  await checkCurrency(t, driver, { carSelector: 'BlackTaxi' });
  await driver.waitForOrderReset();
});

test('Select 2 addresses in Russia', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.moscow.domodedovo, destinationAddress: addresses.moscow.sheremetyevo });
  await checkCurrency(t, driver, { localCurrencySymbol: currencySymbol.RUB });
  await driver.waitForOrderReset();
});

test('Select 2 addresses in Israel', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.jerusalem.ramon, destinationAddress: addresses.jerusalem.eilat });
  await checkCurrency(t, driver, { localCurrencySymbol: currencySymbol.ILS });
  await driver.waitForOrderReset();
});

test('Select 2 addresses in UAE', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.uae.abuDhabi, destinationAddress: addresses.uae.dubai });
  await checkCurrency(t, driver, { localCurrencySymbol: currencySymbol.AED });
  await driver.waitForOrderReset();
});

test('Order Details - Change pickup', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');
  await waitForAddressSelection(t, driver, { selector: ORDER_DETAILS_PICK_UP_ADDRESS, address: addresses.london.bigBen });
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Airport as pickup', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');
  await waitForAddressSelection(t, driver, { selector: ORDER_DETAILS_PICK_UP_ADDRESS, address: addresses.london.heathrowAirport });
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Change destination', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');
  await waitForAddressSelection(t, driver, { selector: ORDER_DETAILS_DESTINATION_ADDRESS, address: addresses.london.theO2 });
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Airport as destination', async (t, driver) => {
  await addressesPreOrder(t, driver, {});
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');
  await waitForAddressSelection(t, driver, { selector: ORDER_DETAILS_DESTINATION_ADDRESS, address: addresses.london.heathrowAirport });
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Add stop points', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');
  await addMaximumStopPoints(t, driver, { selector: ORDER_DETAILS_ADD_STOP_ADDRESS });
});

test('Order Details - Delete stop point', async (t, driver) => {
  await deleteFirstStopPoint(t, driver);
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Order for', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');

  await driver.waitForClick(ORDER_FOR_ITEM);
  await searchItem(t, driver, { search: label.accountName });
  await searchItem(t, driver, { search: label.repeatPassenger });
  await selectSearchItem(t, driver, { search: label.test, searchLabel: label.test, selector: ORDER_FOR_ITEM });

  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Message for driver', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');

  await driver.waitForClick(MESSAGE_FOR_DRIVER_ITEM);
  await fillOrderParam(t, driver, { text: label.someMessage });
  await driver.waitForClick(MESSAGE_FOR_DRIVER_ITEM);
  await fillOrderParam(t, driver, { text: label.longText });
  await driver.waitForClick(MESSAGE_FOR_DRIVER_ITEM);
  await driver.enterInput(SEARCH_INPUT, '');
  await driver[driver.getPlatform() === 'ios' ? 'expectForVisible' : 'waitForVisible'](SEARCH_LIST);
  await driver.expectForVisible(FIRST_SEARCH_IN_LIST);

  t.pass('search list was loaded');

  if (driver.getPlatform() === 'ios') {
    await driver.click(FIRST_SEARCH_IN_LIST);
  } else {
    await driver.waitForClickText(label.callOnArrival);
  }
  await driver.click(MODAL_WITH_CONTENT_CLOSE);
  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Reasons for travel', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');

  await driver.scroll(EDIT_ORDER_DETAILS, 150, 'down');

  await driver.waitForClick(TRIP_REASON_ITEM);

  await searchItem(t, driver, { search: label.passenger });
  await searchItem(t, driver, { search: label.someReason });
  await selectSearchItem(t, driver, { search: label.birthday, searchLabel: label.birthday, selector: TRIP_REASON_ITEM });

  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Payment method', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');

  await driver.scroll(EDIT_ORDER_DETAILS, 300, 'down');
  await driver.waitForClick(PAYMENT_METHOD_ITEM);

  await driver[driver.getPlatform() === 'ios' ? 'expectForVisible' : 'waitForVisible'](PAYMENT_LIST);
  await driver.expectForVisible(FIRST_PAYMENT_IN_LIST);

  t.pass('list was loaded');

  await driver.click(FIRST_PAYMENT_IN_LIST);

  await driver.waitForClick(ORDER_FOR_ITEM);
  await selectSearchItem(t, driver, { search: label.test, searchLabel: label.test, selector: ORDER_FOR_ITEM });
  await driver.waitForClick(PAYMENT_METHOD_ITEM);
  await driver.click(MODAL_WITH_CONTENT_CLOSE);

  await driver.click(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Order Details - Flight number', async (t, driver) => {
  await addressesPreOrder(t, driver, { pickupAddress: addresses.london.theSavoy, destinationAddress: addresses.london.cityAirport });
  await driver.waitForClick(NEXT_BUTTON);
  t.pass('button next was pressed');

  await driver.scroll(EDIT_ORDER_DETAILS, 400, 'down');
  await driver.waitForClick(FLIGHT_NUMBER_ITEM);

  await driver.checkForVisible({ selector: MODAL_WITH_CONTENT });
  t.pass('Modal was opened');

  await driver.enterInput(FLIGHT_MODAL_INPUT, flightNumbers.twoRoutes);
  await driver.waitForClick(FLIGHT_VERIFY_BUTTON);
  t.pass('FN with >= 2 routes');
  await driver.enterInput(FLIGHT_MODAL_INPUT, flightNumbers.invalidDeparture);
  await driver.waitForClick(FLIGHT_VERIFY_BUTTON);
  t.pass('invalid FN for departure ');
  await driver.enterInput(FLIGHT_MODAL_INPUT, flightNumbers.validDeparture);
  await driver.waitForClick(FLIGHT_VERIFY_BUTTON);
  t.pass('valid FN for departure ');
  await driver.enterInput(FLIGHT_MODAL_INPUT, flightNumbers.invalidArrival);
  await driver.waitForClick(FLIGHT_VERIFY_BUTTON);
  t.pass('invalid FN for arrival ');
  await driver.enterInput(FLIGHT_MODAL_INPUT, flightNumbers.validArrival);
  await driver.waitForClick(FLIGHT_VERIFY_BUTTON);
  await driver.waitForClick(FLIGHT_SAVE_BUTTON);
  t.pass('valid FN for arrival ');

  await driver.waitForClick(BACK_BUTTON);
  await driver.waitForOrderReset();
});

test('Preorder page postcondition', async (t, driver) => {
  await driver.postcondition(MENU, async () => {
    await driver.click(ORDER_CREATING_BACK);

    await this.expectForVisible(MENU);
  });
});

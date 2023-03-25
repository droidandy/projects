import { createTypes } from 'redux-compose-reducer';
import { batchActions } from 'redux-batched-actions';
import { isEmpty, snakeCase, omit, noop, pickBy } from 'lodash';

import {
  referencesLocalErrors,
  bookingFieldsToReset,
  messagePrefixes,
  separateMessage,
  getFavouriteAddressMessage,
  formatMessage,
  getStopPoints,
  getOptimisedRoute,
  checkCoordinatesDiff,
  arrayToCoordinates,
  preparePassenger
} from 'utils';
import { addresses, bookings } from 'api';
import faye from 'utils/faye';
import {
  FINAL_STATUSES,
  DRIVER_ON_WAY,
  IN_PROGRESS_STATUS,
  ARRIVED_STATUS,
  ORDER_RECEIVED_STATUS,
  LOCATING_STATUS,
  COMPLETED_STATUSES,
  CANCELLED_STATUS,
  REJECTED_STATUS
} from 'utils/orderStatuses';

import {
  goToActiveOrderScene,
  goToOrderCreatingScene,
  goToCompletedOrderScene,
  AVAILABLE_MAP_SCENES
} from 'actions/ui/navigation';
import { getCurrentUser } from 'actions/session';
import { postEvent } from 'actions/app/gett';

const TYPES = createTypes('booking', [
  'createBookingStart',
  'createBookingFinish',
  'updateCurrentOrder',
  'bookingFailure',
  'changeOrderStatus',
  'changeDriverPath',
  'cancelOrderStart',
  'cancelOrderSuccess',
  'getFormDataStart',
  'getFormDataSuccess',
  'removeFields',
  'changeFields',
  'changeAddress',
  'changeReference',
  'setReferenceErrors',
  'resetBookingValues',
  'changeFlight',
  'getVehiclesStart',
  'getVehiclesSuccess',
  'getFormDetailsSuccess',
  'toggleVisibleModal',
  'setDriver',
  'changeDriverRating',
  'changeDriverRatingReasons',
  'changeDriverRatingSuccess',
  'clearCurrentOrder',
  'saveAvailableCarsScroll',
  'clearBooking',
  'updateReferences',
  'changeMessageModified',
  'changeMessageToDriver',
  'setFutureOrderId',
  'changeSuggestedAddresses',
  'startLoadingSuggestedAddresses',
  'setAllowAutomationPickupChange',
  'setFinalStatus'
]);

const predefinedAddressesLabels = ['Home', 'Work'];

export const removeFields = fields => ({ type: TYPES.removeFields, payload: fields });

export const changeFields = fields => ({ type: TYPES.changeFields, payload: fields });

export const asyncChangeFields = fields => dispatch => (
  Promise.resolve(dispatch(changeFields(fields)))
);

export const changeMessageModified = (modified = false) => ({ type: TYPES.changeMessageModified, modified });

export const saveMessageToDriver = (messageToDriver, modified = false) => (dispatch, getState) => {
  const message = getState().booking.tempMessageToDriver.trim();

  if (modified) {
    dispatch(changeMessageModified(true));
  }

  return dispatch(changeFields({ message: messageToDriver || message }));
};

export const changeMessageToDriver = (message, touched = false) => (
  { type: TYPES.changeMessageToDriver, payload: { message, touched } }
);

const getMessageForAddress = ({ message, address = {}, meta, booking, passenger }) => {
  const { formData: { defaultPickupAddress = {}, defaultDriverMessage } } = booking;
  const { data: { favoriteAddresses } } = passenger;
  const tempMessage = message;
  const isPickup = meta.type === 'pickupAddress';

  const favoriteAddress = favoriteAddresses.find(item => item.name === address.label);
  const type = meta.type.replace('Address', '');

  if (favoriteAddress) {
    tempMessage[`${type}Message`] = getFavouriteAddressMessage(favoriteAddress, type);
  }

  const isCompanyDefaultAddress = address && defaultPickupAddress && address.id === defaultPickupAddress.id;
  const isNotFavoriteAddress = !favoriteAddress || !favoriteAddress[`${type}Message`];

  if (isPickup && isCompanyDefaultAddress && isNotFavoriteAddress) {
    tempMessage.pickupMessage = `${messagePrefixes.pickup} ${defaultDriverMessage}`;
  }

  if (predefinedAddressesLabels.includes(address.label) || isNotFavoriteAddress) {
    tempMessage[`${type}Message`] = '';
  }

  return tempMessage;
};

export const setDefaultMessageToDriver = (address = {}, meta = {}) => (dispatch, getState) => {
  const { booking, passenger } = getState();
  const {
    bookingForm: { message: messageToDriver },
    messageModified
  } = booking;

  let message = separateMessage(messageToDriver);

  if (meta.type !== 'stops' && !messageModified) {
    message = getMessageForAddress({ message, address, meta, booking, passenger });

    dispatch(saveMessageToDriver(formatMessage(message)));
  }
};

export const changeAddress = (address, meta) => (dispatch) => {
  dispatch(setDefaultMessageToDriver(address, meta));

  dispatch({ type: TYPES.changeAddress, payload: { address, meta } });
};

export const changeReference = reference => ({ type: TYPES.changeReference, payload: reference });

export const requestValidateReferences = () => (_, getState) => (
  bookings.validateReferences(getState().booking.bookingForm.bookerReferences)
);

export const setReferenceErrors = errors => ({ type: TYPES.setReferenceErrors, payload: errors });

export const validateReferences = () => async (dispatch, getState) => {
  const { booking: { bookingForm: { bookerReferences }, formData } } = getState();
  let errors = referencesLocalErrors(bookerReferences);

  if (isEmpty(errors) && formData.bookingReferences.length > 0) {
    try {
      await dispatch(requestValidateReferences());
    } catch ({ data }) {
      errors = data.errors;
    }
  }

  dispatch(setReferenceErrors(errors));
  return errors;
};

export const resetBookingValues = () => (dispatch, getState) => {
  const { memberId } = getState().session.user;
  const { currentPosition } = getState().ui.map;
  const { defaultPickupAddress } = getState().booking.formData;

  dispatch(changeMessageModified());

  dispatch(changeMessageToDriver());

  dispatch(saveMessageToDriver());

  dispatch(setDefaultMessageToDriver(currentPosition || defaultPickupAddress, { type: 'pickupAddress' }));

  dispatch({ type: TYPES.resetBookingValues, payload: { memberId } });
};

export const changeFlight = (data, touched = false) => ({ type: TYPES.changeFlight, payload: { data, touched } });

export const saveFlight = () => (dispatch, getState) => {
  const { flight } = getState().booking.tempFlight;
  return dispatch(asyncChangeFields({ flight }));
};

export const savePassenger = passengerId => (dispatch, getState) => {
  const passenger = getState().booking.formData.passengers.find(p => p.id === passengerId);

  dispatch(changeFields(preparePassenger(passenger)));
};

let orderStatusSubscription = null;
let bookingInterval = null;

const removeOrderStatusSubscription = () => faye.cancelSubscription(orderStatusSubscription);

const orderReceivedStatusFlow = (data, delay) => (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();
  const isAsapOrder = (data.asap || currentOrder.asap);

  if (data.status === ORDER_RECEIVED_STATUS && isAsapOrder) {
    setTimeout(() => {
      if (getState().booking.currentOrder.status === ORDER_RECEIVED_STATUS) {
        dispatch({ type: TYPES.changeOrderStatus, data: { ...data, status: LOCATING_STATUS } });
      }
    }, delay);
  }
};

const updateCurrentOrder = data => ({ type: TYPES.updateCurrentOrder, payload: data });

const bookingFailure = errors => ({ type: TYPES.bookingFailure, payload: errors });

export const getBooking = id => dispatch => (
  bookings.getBooking(id)
    .then(({ data }) => {
      dispatch(updateCurrentOrder(data));

      return data;
    })
);

const setBookingUpdater = id => (dispatch) => {
  if (bookingInterval) clearInterval(bookingInterval);
  bookingInterval = setInterval(() => {
    dispatch(getBooking(id)).then((data) => {
      if (FINAL_STATUSES.includes(data.status)) {
        clearInterval(bookingInterval);
      }
    });
  }, 3000);
};

export const getFormData = (ignoreCurrentOrder = false) => (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();

  dispatch({ type: TYPES.getFormDataStart });

  const request = currentOrder.id && !ignoreCurrentOrder
    ? bookings.getInfoForCurrentEditBooking(currentOrder.id)
    : bookings.getInfoForNewBooking();
  return request
    .then(({ data }) => {
      const actions = [
        { type: TYPES.getFormDataSuccess, payload: data },
        { type: TYPES.updateReferences, payload: data.bookingReferences }
      ];

      if (data.booking) {
        actions.push(changeFields({ ...data.booking, vehicleTouched: true }));
      }

      dispatch(batchActions(actions));
      return data;
    });
};

export const orderStatusSubscribe = channel => (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();
  const isFutureOrder = !currentOrder.asap && currentOrder.scheduledAt;

  orderStatusSubscription = faye.on(channel, async ({ data }) => {
    if (data.status === ARRIVED_STATUS) {
      clearInterval(bookingInterval);
    }

    if (data.indicator) {
      if (data.status === DRIVER_ON_WAY) {
        bookings.getBooking(currentOrder.id)
          .then(({ data: driverData }) => {
            dispatch(batchActions([
              {
                type: TYPES.setDriver,
                payload: driverData.driverDetails
              },
              { type: TYPES.changeOrderStatus, data }
            ]));
          });

        dispatch(setBookingUpdater(currentOrder.id));
      } else if (FINAL_STATUSES.includes(data.status)) {
        dispatch(goToCompletedOrderScene());

        dispatch({ type: TYPES.changeOrderStatus, data });

        if ([...COMPLETED_STATUSES, CANCELLED_STATUS, REJECTED_STATUS].includes(data.status)) {
          dispatch({ type: TYPES.setFinalStatus });
        }

        if (isFutureOrder) {
          dispatch(getCurrentUser());
        }

        removeOrderStatusSubscription();
      } else {
        dispatch({ type: TYPES.changeDriverPath, payload: [] });
        dispatch(orderReceivedStatusFlow(data, 2000));
        dispatch({ type: TYPES.changeOrderStatus, data });
      }
    } else if ((data.status === DRIVER_ON_WAY || data.status === IN_PROGRESS_STATUS) && data.driverPath) {
      const resultPath = await getOptimisedRoute(data.driverPath);

      dispatch({
        type: TYPES.changeDriverPath,
        payload: resultPath.filter((item, index) => (
          (index + 1) < resultPath.length ? !checkCoordinatesDiff(item, resultPath[index + 1]) : item
        ))
      });
    }
  });
};

export const finishOrderCreating = () => (dispatch) => {
  // We need to use setTimeout for prevent re-render `Order Ride` button
  setTimeout(() => {
    dispatch({ type: TYPES.createBookingFinish });
  }, 150);
};

export const createBooking = order => (dispatch, getState) => {
  const { booking: { bookingForm, currentOrder } } = getState();
  const isFutureOrder = bookingForm.scheduledType === 'later';

  dispatch({ type: TYPES.createBookingStart });

  return bookings.createBooking(order)
    .then(({ data }) => {
      if (!currentOrder.id) {
        dispatch(updateCurrentOrder(data));

        if (isFutureOrder) {
          dispatch(getCurrentUser());
        }

        dispatch(goToActiveOrderScene());
        dispatch(orderStatusSubscribe(data.channel));
      } else {
        dispatch({ type: TYPES.setFutureOrderId, payload: data.id });
      }

      dispatch(finishOrderCreating());

      return data;
    })
    .catch(({ data }) => {
      const referenceErrors = pickBy(data.errors, (_, key) => key.startsWith('bookerReferences'));
      if (!isEmpty(referenceErrors)) {
        dispatch(setReferenceErrors(referenceErrors));
      }

      dispatch(bookingFailure(!isEmpty(referenceErrors) ? { referenceErrors } : data.errors));

      return Promise.reject(data.errors);
    });
};

export const updateBooking = () => (dispatch, getState) => {
  const { booking: { bookingForm } } = getState();

  dispatch({ type: TYPES.createBookingStart });

  const order = {
    ...omit(bookingForm, 'status'),
    stops: getStopPoints(bookingForm),
    stopAddresses: getStopPoints(bookingForm)
  };

  return bookings.updateBooking(bookingForm.id, order)
    .then(({ data }) => {
      dispatch(finishOrderCreating());
      return dispatch(updateCurrentOrder(data));
    })
    .catch(({ data }) => {
      dispatch(bookingFailure(data.errors));
      return Promise.reject(data.errors);
    });
};

const sendEventOnActivatingByPush = (order, byPush) => (dispatch) => {
  if (byPush) {
    dispatch(postEvent('push_notification|app_open_from_push', { order_status: order.indicatedStatus }));
  }
};

export const setActiveBooking = (id, { byPush } = {}) => async (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();

  if (currentOrder.id === id) {
    dispatch(sendEventOnActivatingByPush(currentOrder, byPush));
    return Promise.resolve();
  }

  const { data } = await bookings.getBooking(id);
  const path = data.path?.length && await getOptimisedRoute(data.path.map(arrayToCoordinates));

  dispatch(sendEventOnActivatingByPush(data, byPush));

  dispatch(updateCurrentOrder({ ...data, path }));

  if (data.status === DRIVER_ON_WAY) {
    dispatch(setBookingUpdater(id));
  }

  if (FINAL_STATUSES.includes(data.status)) {
    dispatch(goToCompletedOrderScene());
  } else {
    dispatch(goToActiveOrderScene());

    dispatch(orderReceivedStatusFlow(data, 100));
    dispatch(orderStatusSubscribe(data.channel));
  }

  return data;
};

export const clearCurrentOrder = () => dispatch => (
  Promise.resolve((() => {
    dispatch(removeFields(bookingFieldsToReset));
    dispatch(resetBookingValues());

    removeOrderStatusSubscription();
    dispatch(goToOrderCreatingScene());
    dispatch({ type: TYPES.clearCurrentOrder });
    clearInterval(bookingInterval);
  })())
);

export const cancelOrder = params => (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();
  const isFutureOrder = !currentOrder.asap && currentOrder.scheduledAt;

  dispatch({ type: TYPES.cancelOrderStart });

  return bookings.cancelBooking(currentOrder.id, { ...params, cancellation_fee: false })
    .then(() => {
      const { ui: { navigation: { activeScene } } } = getState();

      dispatch({ type: TYPES.cancelOrderSuccess });
      if (activeScene === AVAILABLE_MAP_SCENES.activeOrder) dispatch(goToCompletedOrderScene());

      if (isFutureOrder) {
        dispatch(getCurrentUser());
      }

      removeOrderStatusSubscription();
    });
};

export const sendCancelOrderReason = reason => (dispatch, getState) => {
  const { booking: { currentOrder } } = getState();

  return bookings.sendCancellationReason(currentOrder.id, reason);
};

export const getFormDetails = (booking, params) => (dispatch) => {
  if (params.requestVehicles) dispatch({ type: TYPES.getVehiclesStart });

  return bookings.getFormDetails(booking, params)
    .then((res) => {
      dispatch({ type: TYPES.getFormDetailsSuccess, payload: res });
      return res;
    });
};

export const toggleVisibleModal = name => ({ type: TYPES.toggleVisibleModal, payload: name });

export const changeDriverRating = rating => (dispatch, getState) => {
  const { tempDriverRatingReasons } = getState().booking.currentOrder;

  dispatch({
    type: TYPES.changeDriverRating,
    payload: { rating, ratingReasons: rating <= 4 ? (tempDriverRatingReasons || []) : [] }
  });
};

export const changeDriverRatingReasons = name => (dispatch) => {
  dispatch({ type: TYPES.changeDriverRatingReasons, payload: name });
};

export const rateDriver = () => (dispatch, getState) => {
  const { id, tempDriverRating, tempDriverRatingReasons } = getState().booking.currentOrder;
  return bookings.rateBooking(id, {
    rating: tempDriverRating,
    rating_reasons: (tempDriverRatingReasons && tempDriverRatingReasons) || []
  })
    .then(() => dispatch({ type: TYPES.changeDriverRatingSuccess }));
};

export const saveAvailableCarsScroll = value => ({ type: TYPES.saveAvailableCarsScroll, payload: value });

export const changeSuggestedAddresses = payload => ({ type: TYPES.changeSuggestedAddresses, payload });

export const getSuggestedAddresses = criterion => (dispatch, getState) => {
  const { latitude, longitude } = getState().ui.map.currentPosition || {};
  const { lat, lng } = getState().booking.formData.defaultPickupAddress;

  const position = { lat: latitude || lat, lng: longitude || lng };

  dispatch({ type: TYPES.startLoadingSuggestedAddresses, payload: criterion });

  return addresses.quickSearch({ criterion: snakeCase(criterion), ...position })
    .then(({ data }) => {
      dispatch(changeSuggestedAddresses({ [criterion]: { ...data, loaded: true } }));
      return data;
    }).catch(noop);
};

export const setAllowAutomationPickupChange = value => ({ type: TYPES.setAllowAutomationPickupChange, payload: value });

export const clearBooking = () => ({ type: TYPES.clearBooking });

import { createTypes } from 'redux-compose-reducer';
import { batchActions } from 'redux-batched-actions';
import { noop, curry } from 'lodash';

import { formatPhoneNumber } from 'utils';
import { passengerAddresses, passengerPaymentCards, passengers, company } from 'api';

import { changeFields } from './booking';
import { postEvent } from './app/gett';

const TYPES = createTypes('passenger', [
  'getPassengerDataStart',
  'getPassengerDataSuccess',
  'setInitialProfileValues',
  'changeProfileFieldValue',
  'sendProfileDataStart',
  'sendProfileDataSuccess',
  'sendAddressStart',
  'updatePredefinedAddress',
  'updateFavouriteAddress',
  'addFavouriteAddress',
  'destroyFavoriteAddress',
  'makeDefaultPayment',
  'deactivatePayment',
  'changePassengerField',
  'changeToggleValueStart',
  'changeToggleValueSuccess',
  'changeToggleValueFailure',
  'touchField',
  'setTempAddress',
  'changeTempAddressField',
  'changeTempAddress',
  'setValidationError',
  'changePaymentField',
  'changePaymentFields',
  'resetPaymentFields',
  'addPaymentCardType',
  'clearPassenger',
  'getCompanySettings',
  'changeSwipedItem'
]);

export const getCompanySettings = () => (dispatch) => {
  company.getCompanySettings().then(({ data }) => {
    dispatch({ type: TYPES.getCompanySettings, payload: data.data });
  });
};

export const getPassengerData = () => (dispatch, getState) => {
  if (getState().passenger.busy) {
    return Promise.resolve();
  }

  dispatch({ type: TYPES.getPassengerDataStart });

  const id = getState().session.user.memberId;

  return passengers.getPassengerData(id)
    .then(({ data }) => {
      dispatch({ type: TYPES.getPassengerDataSuccess, payload: data });

      return data;
    })
    .catch(noop);
};

export const setInitialProfileValues = () => ({ type: TYPES.setInitialProfileValues });

export const changeProfileFieldValue = curry((field, value) => (
  { type: TYPES.changeProfileFieldValue, payload: { field, value } }
));

export const setValidationError = (path, error) => ({ type: TYPES.setValidationError, payload: { path, error } });

export const sendProfileData = () => (dispatch, getState) => {
  dispatch({ type: TYPES.sendProfileDataStart });

  const { session, passenger: { temp, data: { passenger } } } = getState();
  const id = session.user.memberId;

  const trimmedTemp = {
    ...temp,
    firstName: temp.firstName.trim(),
    lastName: temp.lastName.trim(),
    phone: formatPhoneNumber(temp.phone),
    mobile: formatPhoneNumber(temp.mobile)
  };

  return passengers.updatePassengerData(id, trimmedTemp)
    .then(() => {
      dispatch(changeProfileFieldValue('firstName', trimmedTemp.firstName));
      dispatch(changeProfileFieldValue('lastName', trimmedTemp.lastName));

      dispatch({ type: TYPES.sendProfileDataSuccess });
      dispatch(changeFields({
        passengerName: `${trimmedTemp.firstName} ${trimmedTemp.lastName}`,
        passengerPhone: formatPhoneNumber(trimmedTemp[temp.defaultPhoneType || passenger.defaultPhoneType])
      }));
    })
    .catch(({ data }) => {
      dispatch(setValidationError('temp.validationError', data.errors));
      throw data;
    });
};

export const setTempAddress = address => ({ type: TYPES.setTempAddress, payload: address });

export const changeTempAddressField = (field, value) => (
  { type: TYPES.changeTempAddressField, payload: { field, value } }
);

export const changeTempAddress = address => ({ type: TYPES.changeTempAddress, payload: address });

export const sendPredefinedAddress = (address, type) => (dispatch, getState) => {
  const passengerId = getState().session.user.memberId;

  return passengers.updatePassengerData(passengerId, { passenger: { [`${type}Address`]: address } })
    .then((res) => {
      dispatch({ type: TYPES.updatePredefinedAddress, payload: { type, address } });
      return res;
    });
};

const sendFavouriteAddress = ({ passengerId, address }) => dispatch => (
  passengerAddresses.updateAddress(passengerId, address.id, address)
    .then((res) => {
      dispatch({ type: TYPES.updateFavouriteAddress, payload: res.data });
      return res;
    })
);

const createFavouriteAddress = ({ passengerId, address }) => dispatch => (
  passengerAddresses.createAddress(passengerId, { ...address, type: 'favorite' })
    .then((res) => {
      dispatch({ type: TYPES.addFavouriteAddress, payload: res.data });
      return res;
    })
);

export const sendAddress = () => (dispatch, getState) => {
  const passengerId = getState().session.user.memberId;
  let address = getState().passenger.temp.address;
  let req;

  address = {
    ...address,
    name: address.name.trim(),
    pickupMessage: (address.pickupMessage || '').trim(),
    destinationMessage: (address.destinationMessage || '').trim()
  };

  if (address.id) {
    req = dispatch(sendFavouriteAddress({ passengerId, address }));
  } else {
    req = dispatch(createFavouriteAddress({ passengerId, address }));
  }

  return req
    .catch(({ data }) => {
      dispatch(setValidationError('temp.addressErrors', data.errors));
      throw data;
    });
};

export const destroyFavoriteAddress = id => (dispatch, getState) => {
  const passengerId = getState().session.user.memberId;

  return passengerAddresses.removeAddress(passengerId, id)
    .then(() => dispatch({ type: TYPES.destroyFavoriteAddress, payload: id }));
};

export const makeDefault = id => ({ type: TYPES.makeDefaultPayment, payload: id });

export const makeDefaultPayment = id => (dispatch, getState) => {
  const {
    session: { user: { memberId: passengerId } }
  } = getState();

  return passengerPaymentCards.makeDefaultPaymentCard(passengerId, id)
    .then(() => dispatch(makeDefault(id)));
};

export const deactivate = id => ({ type: TYPES.deactivatePayment, payload: id });

export const deactivatePayment = id => (dispatch, getState) => {
  const passengerId = getState().session.user.memberId;

  return passengerPaymentCards.removePaymentCard(passengerId, id)
    .then(() => dispatch(deactivate(id)));
};

export const changeToggleValue = curry((field, value) => (dispatch, getState) => {
  if (getState().passenger.busy) {
    return Promise.resolve();
  }

  dispatch({ type: TYPES.changeToggleValueStart, payload: { field, value } });

  const id = getState().session.user.memberId;

  return passengers.updatePassengerData(id, { [field]: value })
    .then(() => {
      dispatch({ type: TYPES.changeToggleValueSuccess });
    })
    .catch(() => {
      dispatch({ type: TYPES.changeToggleValueFailure, payload: { field }, error: true });
    });
});

export const changeNotifyWithEmail = changeToggleValue('notifyWithEmail');
export const changeNotifyWithSms = changeToggleValue('notifyWithSms');
export const changeNotifyWithPush = value => (dispatch, getState) => {
  changeToggleValue('notifyWithPush', value)(dispatch, getState)
    .then(() => dispatch(postEvent('app_menu|push_notifications|toggle_switched', { new_toggle_position: value })));
};
export const changeNotifyWithCalendarEvent = changeToggleValue('notifyWithCalendarEvent');
export const changeWheelchairUser = changeToggleValue('wheelchairUser');

const changePassengerField = (field, value) => ({ type: TYPES.changePassengerField, payload: { field, value } });

export const makeDefaultPhone = (field, value) => (dispatch, getState) => {
  const { passenger: { data: { passenger } }, session: { user: { memberId } } } = getState();

  dispatch(changePassengerField(field, value));

  return passengers.updatePassengerData(memberId, { [field]: value })
    .then(() => {
      dispatch(changeFields({
        passengerPhone: formatPhoneNumber(passenger[value])
      }));
    })
    .catch(() => {
      dispatch(changePassengerField(field, passenger[field]));
    });
};

export const touchField = (field, value = true) => ({ type: TYPES.touchField, payload: { field, value } });

export const changePaymentField = (field, value) => ({ type: TYPES.changePaymentField, payload: { field, value } });

export const changePaymentFields = fields => ({ type: TYPES.changePaymentFields, payload: fields });

export const resetPaymentFields = () => ({ type: TYPES.resetPaymentFields });

export const addPaymentCardType = data => ({ type: TYPES.addPaymentCardType, payload: data });

export const addPaymentCard = () => (dispatch, getState) => {
  const {
    session: { user: { memberId: passengerId } },
    passenger: { newPaymentData }
  } = getState();

  return passengerPaymentCards.createPaymentCard(passengerId, newPaymentData)
    .then((res) => {
      dispatch(batchActions([
        addPaymentCardType(res.data),
        resetPaymentFields()
      ]));
    })
    .catch((err) => {
      dispatch(setValidationError('validationPaymentError', {}));
      throw err;
    });
};

const changeSwipedItem = curry((field, value) => ({ type: TYPES.changeSwipedItem, payload: { field, value } }));

export const changeSwipedPaymentCard = changeSwipedItem('CardId');
export const changeSwipedAddress = changeSwipedItem('AddressId');

export const clearPassenger = () => ({ type: TYPES.clearPassenger });

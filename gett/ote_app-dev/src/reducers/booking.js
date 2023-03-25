import { composeReducer } from 'redux-compose-reducer';
import update from 'update-js';
import { isUndefined, omit, xor } from 'lodash';
import { CANCELLED_STATUS } from 'utils/orderStatuses';
import { getPassengerPayload, prepareStopPoint, prepareVehicleAttrs } from 'utils';
import { paymentTypeToAttrs } from 'containers/shared/bookings/data';

export const initialState = {
  formData: { busy: false },
  bookingForm: {
    availableCarsScroll: 0,
    travelReasonId: '',
    bookerReferences: [],
    bookerReferencesErrors: {},
    scheduledAt: null,
    scheduledType: 'now',
    schedule: null
  },
  vehiclesData: { loading: false, loaded: false, vehicles: [] },
  currentOrder: { busy: false, driverPath: [] },
  suggestedAddresses: {
    recent: {},
    airport: {},
    trainStation: {},
    lodging: {},
    restaurant: {},
    pointOfInterest: {},
    loadingType: ''
  },
  orderErrors: null,
  tempMessageToDriver: '',
  messageModified: false,
  futureOrderId: null,
  allowAutomationPickupChange: true,
  messageToDriverTouched: false,
  tempFlight: null,
  flightTouched: false
};

const getFormDataStart = state => update(state, 'formData.busy', true);

const getFormDataSuccess = (state, { payload }) => (
  update.assign(state, 'formData', { ...payload, busy: false })
);

const removeFields = (state, { payload }) => update(state, 'bookingForm', omit(state.bookingForm, payload));

const changeFields = (state, { payload }) => update.assign(state, 'bookingForm', payload);

const changeMessageModified = (state, { modified }) => update.assign(state, { messageModified: modified });

const changeMessageToDriver = (state, { payload }) => (
  update(state, { tempMessageToDriver: payload.message || '', messageToDriverTouched: payload.touched })
);

const changeAddress = (state, { payload: { address, meta } }) => {
  if (meta.type !== 'stops') {
    return update(state, `bookingForm.${meta.type}`, address);
  }

  const preparedStop = prepareStopPoint(address, state.bookingForm);

  if (!isUndefined(meta.index)) {
    update(state, `bookingForm.stops.${meta.index}`, preparedStop);
  }

  if (!state.bookingForm.stops) {
    return update(state, 'bookingForm.stops', [preparedStop]);
  }

  return update.push(state, 'bookingForm.stops', preparedStop);
};

const updateReferences = (state, { payload }) => (
  update(state, {
    'bookingForm.bookerReferences': payload.map(r => ({ ...r, bookingReferenceId: r.id })),
    'bookingForm.bookerReferencesErrors': {}
  })
);

const changeReference = (state, { payload }) => (
  update(state, {
    [`bookingForm.bookerReferences.{id:${payload.id}}.value`]: payload.value,
    'bookingForm.bookerReferencesErrors': {}
  })
);

const setReferenceErrors = (state, { payload }) => update(state, 'bookingForm.bookerReferencesErrors', payload);

const resetBookingValues = (state, { payload }) => {
  const passenger = getPassengerPayload(state.formData, payload.memberId);

  return update(state, {
    bookingForm: update.assign({
      bookerReferences: state.formData.bookingReferences.map(r => ({ ...r, bookingReferenceId: r.id })),
      bookerReferencesErrors: {},
      scheduledType: 'now',
      scheduledAt: null,
      ...passenger,
      availableCarsScroll: 0
    }),
    vehiclesData: initialState.vehiclesData
  });
};

const changeFlight = (state, { payload }) => (
  update(state, { tempFlight: payload.data, flightTouched: payload.touched })
);

const getVehiclesStart = state => (
  update.assign(state, 'vehiclesData', { loading: true })
);

const getVehiclesSuccess = (state, { payload }) => (
  update.assign(state, 'vehiclesData', { ...payload, loading: false, loaded: true })
);

const setFutureOrderId = (state, { payload }) => (
  update(state, {
    futureOrderId: payload,
    'currentOrder.busy': false
  })
);

const createBookingStart = state => (
  update(state, {
    'currentOrder.busy': true,
    orderErrors: null
  })
);

const updateCurrentOrder = (state, { payload }) => update.assign(state, 'currentOrder', payload);

const createBookingFinish = state => update(state, 'currentOrder.busy', false);

const bookingFailure = (state, { payload }) => (
  update(state, {
    currentOrder: update.assign({ busy: false }),
    orderErrors: payload
  })
);

const cancelOrderStart = state => (
  update(state, {
    'currentOrder.busy': true,
    orderErrors: null
  })
);

const cancelOrderSuccess = state => (
  update(state, {
    'currentOrder.busy': false,
    'currentOrder.status': CANCELLED_STATUS,
    'currentOrder.indicatedStatus': CANCELLED_STATUS,
    orderErrors: null
  })
);

const setDriver = (state, { payload }) => update(state, 'currentOrder.driverDetails', payload);

const setFinalStatus = state => update(state, 'currentOrder.final', true);

const changeOrderStatus = (state, { data }) => (
  update.assign(state, 'currentOrder', {
    serviceId: data.serviceId,
    status: data.status,
    indicatedStatus: data.status
  })
);

const changeDriverPath = (state, { payload }) => update(state, { 'currentOrder.driverPath': payload });

const toggleVisibleModal = (state, { payload }) => update(state, `modals.${payload}`, !state.modals[payload]);

const changeDriverRating = (state, { payload: { rating, ratingReasons } }) => (
  update(state, {
    'currentOrder.tempDriverRating': rating,
    'currentOrder.tempDriverRatingReasons': ratingReasons
  })
);

const changeDriverRatingReasons = (state, { payload }) => (
  update.with(state, 'currentOrder.tempDriverRatingReasons', old => xor(old, [payload]))
);

const changeDriverRatingSuccess = state => (
  update(state, {
    'currentOrder.rateable': false,
    'currentOrder.driverDetails.tripRating': state.currentOrder.tempDriverRating,
    'currentOrder.tempDriverRating': null,
    'currentOrder.tempDriverRatingReasons': []
  })
);

const clearCurrentOrder = state => update(state, 'currentOrder', initialState.currentOrder);

const saveAvailableCarsScroll = (state, { payload }) => update(state, 'bookingForm.availableCarsScroll', payload);

const startLoadingSuggestedAddresses = (state, { payload }) => (
  update(state, 'suggestedAddresses', { ...state.suggestedAddresses, loadingType: payload })
);

const changeSuggestedAddresses = (state, { payload }) => (
  update(state, 'suggestedAddresses', { ...state.suggestedAddresses, ...payload, loadingType: '' })
);

const setAllowAutomationPickupChange = (state, { payload }) => (
  update(state, 'allowAutomationPickupChange', payload)
);

const getFormDetailsSuccess = (state, { payload }) => {
  const { attrs, vehiclesData, ...rest } = payload;
  let newState = state;

  if (attrs) {
    const { vehicle, paymentType, ...rest } = attrs;
    newState = update.assign(newState, 'bookingForm', {
      ...(vehicle && prepareVehicleAttrs(vehicle, { touched: false })),
      ...(paymentType && paymentTypeToAttrs(paymentType)),
      ...rest
    });
  }

  if (vehiclesData) {
    newState = getVehiclesSuccess(newState, { payload: vehiclesData });
  }

  return update.assign(newState, 'formData', { ...rest, busy: false });
};

const clearBooking = () => initialState;

export default composeReducer('booking', {
  getFormDataStart,
  getFormDataSuccess,
  getFormDetailsSuccess,
  removeFields,
  changeFields,
  changeAddress,
  changeReference,
  setReferenceErrors,
  resetBookingValues,
  changeMessageModified,
  changeMessageToDriver,
  changeFlight,
  getVehiclesStart,
  getVehiclesSuccess,
  toggleVisibleModal,
  createBookingStart,
  createBookingFinish,
  updateCurrentOrder,
  bookingFailure,
  cancelOrderStart,
  cancelOrderSuccess,
  changeOrderStatus,
  changeDriverPath,
  setDriver,
  changeDriverRating,
  changeDriverRatingReasons,
  changeDriverRatingSuccess,
  clearCurrentOrder,
  saveAvailableCarsScroll,
  clearBooking,
  updateReferences,
  setFutureOrderId,
  startLoadingSuggestedAddresses,
  changeSuggestedAddresses,
  setAllowAutomationPickupChange,
  setFinalStatus
}, initialState);

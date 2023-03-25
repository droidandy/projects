import { reduce } from 'js/redux';
import { flightstatsReducers, initialState as flightstatsState } from 'utils/flightstats';
import { baseVehicles } from 'pages/shared/bookings/data';
import { pick, isEmpty } from 'lodash';
import update from 'update-js';

const initialState = {
  list: {
    loading: false,
    items: [],
    pagination: {
      current: 1,
      pageSize: 10
    },
    query: {
      search: ''
    },
    paymentMethods: []
  },
  validatedReferences: [],
  formData: {
    loading: false,
    saving: false,
    passengers: [],
    journeyTypes: [],
    travelReasons: [],
    bookers: [],
    bookingReferences: [],
    paymentTypes: [],
    paymentTypeOptions: [],
    specialRequirementOptions: [],
    vehicleVendorOptions: [],
    unavailableScheduledAts: [],
    flight: flightstatsState,
    vehicles: {
      data: baseVehicles // used to initially render set of unavailable vehicles
    },
    referenceEntries: {},
    can: {},
    destinationAddress: {}
  },
  summary: {}
};

export default reduce('bookings', initialState, (reducer) => {
  reducer('getFormDataSuccess', (state, formData) => {
    return update(state, 'formData', { ...initialState.formData, ...formData });
  });

  reducer('getFormDetails', (state, params = {}) => {
    const updates = { 'formData.loading': true };

    if (params.dropUnavailableScheduledAts) {
      updates['formData.unavailableScheduledAts'] = [];
    }

    if (params && params.booking) {
      if (params.booking.destinationAddress) {
        updates['formData.destinationAddress'] = params.booking.destinationAddress;
      }
      updates['formData.asDirected'] = params.booking.asDirected;
    }

    return update(state, updates);
  });

  reducer('getFormDetailsSuccess', (state, formData) => {
    const updates = {
      'formData.loading': false,
      'formData.loaded': true,
      'formData.specialRequirementOptions': formData.specialRequirementOptions
    };

    if (isEmpty(state.formData.destinationAddress) && !state.formData.asDirected) {
      updates['formData.vehicles'] = { data: baseVehicles };
    } else if ('vehiclesData' in formData) {
      const { vehicles, distance, duration, bookingFee } = formData.vehiclesData;

      updates['formData.vehicles'] = {
        data: vehicles,
        failed: false,
        distance,
        duration,
        bookingFee
      };
    }

    ['unavailableScheduledAts', 'paymentTypeOptions', 'vehicleVendorOptions', 'journeyTypes'].forEach((key) => {
      if (key in formData) {
        updates[`formData.${key}`] = formData[key];
      }
    });

    return update(state, updates);
  });

  reducer('getFormDetailsFailure', (state) => {
    return update(state, {
      'formData.loading': false,
      'formData.vehicles': { data: baseVehicles, failed: true }
    });
  });

  flightstatsReducers(reducer, 'formData');

  reducer('saveBooking', (state) => {
    return update(state, 'formData.saving', true);
  });

  reducer('saveBookingSuccess', (state) => {
    return update(state, 'formData.saving', false);
  });

  reducer('saveBookingFailure', (state) => {
    return update(state, {
      'summary': {},
      'formData.saving': false
    });
  });

  reducer('getBookings', (state, query, setLoading) => {
    const updates = {};

    if (setLoading) {
      updates['list.loading'] = true;
    }

    if (query && query !== state.list.query) {
      updates['list.query'] = query;
    }

    return update(state, updates);
  });

  reducer('getBookingsSuccess', (state, data) => {
    return update.assign(state, 'list', { ...data, loading: false });
  });

  reducer('getBookingItemSuccess', (state, booking) => {
    const bookingItem = pick(booking, [
      'id', 'serviceId', 'orderId', 'scheduledAt', 'serviceType', 'vehicleType', 'pickupAddress', 'destinationAddress',
      'timezone', 'passenger', 'passengerAvatarUrl', 'paymentMethod', 'paymentMethodTitle', 'fareQuote',
      'eta', 'status', 'indicatedStatus', 'journeyType', 'alertLevel', 'final', 'recurringNext', 'via'
    ]);

    try {
      const nextState = update(state, `list.items.{id:${booking.id}}`, bookingItem);

      if (state.summary.id === booking.id) {
        nextState.summary = booking;
      }

      return nextState;
    } catch (error) {
      // if item `{id:${booking.id}}` is no longer in the list by the time we have
      // getBookingItemSuccess response, just ignore the update
      if (!/no object found/.test(error.message)) {
        throw error;
      } else {
        return state;
      }
    }
  });

  reducer('getVehicles', (state) => {
    return update.assign(state, 'formData.vehicles', {
      loading: true,
      loaded: false
    });
  });

  reducer('getBooking', (state) => {
    return update(state, 'summary', {});
  });

  reducer('getBookingSuccess', (state, summary) => {
    return update(state, 'summary', summary);
  });

  reducer('rateBookingSuccess', (state, { id, rating }) => {
    return update(state, `list.items.{id:${id}}.driverDetails.tripRating`, rating);
  });

  reducer('getReferenceEntriesSuccess', (state, { referenceId, entries }) => {
    return update(state, `formData.referenceEntries.${referenceId}`, entries);
  });

  reducer('getReferencesSuccess', (state, references) => {
    return update(state, 'formData.bookingReferences', references);
  });

  reducer('validateReferencesSuccess', (state, validatedReferences) => {
    return { ...state, validatedReferences };
  });

  reducer('clearValidatedReferences', (state) => {
    return { ...state, validatedReferences: [] };
  });
});

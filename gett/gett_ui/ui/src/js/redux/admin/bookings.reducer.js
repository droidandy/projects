import { reduce } from 'js/redux';
import update from 'update-js';
import { backOfficeBaseVehicles } from 'pages/shared/bookings/data';
import { flightstatsReducers, initialState as flightstatsState } from 'utils/flightstats';
import { find, pick } from 'lodash';

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
    counts: {}
  },
  changeLog: [],
  // TODO: DRY with app/bookings.reducers.js
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
      data: backOfficeBaseVehicles // used to initially render set of unavailable vehicles
    },
    referenceEntries: {},
    can: {}
  },
  summary: {},
  pricing: {
    bookers: [],
    can: {},
    form: {},
    loading: false
  },
  comments: []
};

export default reduce('bookings', initialState, (reducer) => {
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
      'eta', 'status', 'indicatedStatus', 'journeyType', 'alertLevel', 'final', 'recurringNext',
      'companyName', 'companyId', 'passengerId', 'labels', 'vendorName', 'via'
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

  reducer('getBooking', (state) => {
    return update(state, 'summary', {});
  });

  reducer('getBookingSuccess', (state, summary) => {
    return update(state, 'summary', summary);
  });

  reducer('cancelBookingSuccess', (state, summary) => {
    if (state.summary.id === summary.id) {
      return update(state, 'summary', summary);
    } else {
      return state;
    }
  });

  // TODO: DRY with app/bookings.reducers.js
  reducer('getFormDetails', (state, params = {}) => {
    const updates = { 'formData.loading': true };

    if (params.dropUnavailableScheduledAts) {
      updates['formData.unavailableScheduledAts'] = [];
    }

    return update(state, updates);
  });

  reducer('getFormDetailsSuccess', (state, formData) => {
    const updates = {
      'formData.loading': false,
      'formData.loaded': true,
      'formData.specialRequirementOptions': formData.specialRequirementOptions
    };

    if ('vehiclesData' in formData) {
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
      'formData.vehicles': { data: backOfficeBaseVehicles, failed: true }
    });
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return update(state, 'formData', { ...initialState.formData, ...formData });
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

  reducer('getReferenceEntriesSuccess', (state, { referenceId, entries }) => {
    return update(state, `formData.referenceEntries.${referenceId}`, entries);
  });

  reducer('getPricing', (state) => {
    return update(state, 'pricing', { ...initialState.pricing, loading: true });
  });

  reducer('getPricingSuccess', (state, pricing) => {
    return { ...state, pricing };
  });

  reducer('savePricing', (state) => {
    return update(state, 'pricing.loading', true);
  });

  reducer('savePricingSuccess', (state, booking) => {
    const nextState = update(state, 'pricing.loading', false);

    if (find(state.list.items, { id: booking.id })) {
      update.in(nextState, `list.items.{id:${booking.id}}`, booking);
    }

    return nextState;
  });

  reducer('clearAlertSuccess', (state, bookingId, alertId) => {
    return update.remove(state, `summary.alerts.{id:${alertId}}`);
  });

  reducer('getCommentsSuccess', (state, comments) => {
    return { ...state, comments };
  });

  reducer('addComment', (state, comment) => {
    return update.add(state, 'comments', comment);
  });

  reducer('getLogSuccess', (state, changeLog) => {
    return { ...state, changeLog };
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

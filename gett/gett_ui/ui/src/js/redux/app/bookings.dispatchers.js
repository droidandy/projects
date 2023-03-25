import { namespace } from 'js/redux';
import { get, post, put, RequestsValve } from 'utils';
import { isMobile } from 'utils/userAgent';
import { flightstatsDispatchers } from 'utils/flightstats';
import axios, { CancelToken } from 'axios';

export default namespace('bookings', (dispatcher, action) => {
  dispatcher('getFormData', (dispatch, bookingId, bookingAction) => {
    const path = bookingId ? `/bookings/${bookingId}/${bookingAction}` : '/bookings/new';

    return get(path)
      .then((res) => {
        dispatch(action('getFormDataSuccess', res.data));
        return res.data;
      });
  });

  let cancelGetFormDetails;

  dispatcher('getFormDetails', (dispatch, params) => {
    if (cancelGetFormDetails) {
      cancelGetFormDetails();
    } else {
      dispatch(action('getFormDetails', params));
    }

    return post('/bookings/form_details', params, { cancelToken: new CancelToken(c => cancelGetFormDetails = c) })
      .then((res) => {
        cancelGetFormDetails = null;

        dispatch(action('getFormDetailsSuccess', res.data));

        return res.data;
      }).catch((err) => {
        if (!axios.isCancel(err)) {
          cancelGetFormDetails = null;

          dispatch(action('getFormDetailsFailure'));
        }
        throw err;
      });
  });

  flightstatsDispatchers(dispatcher, action);

  dispatcher('saveBooking', (dispatch, booking) => {
    booking = {
      ...booking,
      scheduledAt: booking.scheduledType === 'now' ? undefined : booking.scheduledAt.format(),
      sourceType: isMobile ? 'web_mobile' : 'web'
    };

    dispatch(action('saveBooking'));

    const request = booking.id ? put(`/bookings/${booking.id}`, booking) : post('/bookings', booking);

    return request
      .then((res) => {
        dispatch(action('saveBookingSuccess', res.data));
        return res.data;
      }).catch((err) => {
        dispatch(action('saveBookingFailure'));
        throw err;
      });
  });

  const valve = new RequestsValve;

  // TODO: DRY with admin/bookings.dispatcher.js
  dispatcher('getBookings', (dispatch, query, update, setLoading) => {
    dispatch(action('getBookings', query, setLoading));

    return valve.whenReady(() => {
      dispatch(action('getBookings', query, setLoading));

      return get('/bookings', query)
        .then((res) => {
          if (update) dispatch(action('getBookingsSuccess', res.data));
          return res.data;
        });
    });
  });

  dispatcher('getBookingItem', (dispatch, id) => {
    return get(`/bookings/${id}`)
      .then((res) => {
        dispatch(action('getBookingItemSuccess', res.data));
      });
  });

  dispatcher('getBooking', (dispatch, id) => {
    dispatch(action('getBooking'));

    return get(`/bookings/${id}`)
      .then((res) => {
        dispatch(action('getBookingSuccess', res.data));
      });
  });

  dispatcher('cancelBooking', (dispatch, id, params = {}) => {
    return put(`/bookings/${id}/cancel`, params)
      .then((res) => {
        // 'getBookingItemSuccess' is issued to update both table row and
        // booking details (if cancelled booking is expanded row)
        dispatch(action('getBookingItemSuccess', res.data));
      }).catch((err) => {
        return Promise.reject(err.response.data.errors.message);
      });
  });

  dispatcher('rateBooking', (dispatch, id, rating) => {
    return put(`/bookings/${id}/rate`, { rating })
      .then(() => {
        dispatch(action('rateBookingSuccess', { id, rating }));
      });
  });

  dispatcher('saveFeedback', (dispatch, id, feedback) => {
    // NOTE: no actual actions to update store are designed at this point.
    return post(`/bookings/${id}/feedbacks`, { feedback });
  });

  dispatcher('getReferenceEntries', (dispatch, referenceId, searchTerm) => {
    return get(`/booking_references/${referenceId}/reference_entries`, { searchTerm })
      .then((res) => {
        dispatch(action('getReferenceEntriesSuccess', { referenceId, entries: res.data.items }));
      });
  });

  dispatcher('getReferences', (dispatch, bookingId) => {
    return get('/bookings/references', { bookingId })
      .then((res) => {
        dispatch(action('getReferencesSuccess', res.data));

        return res.data;
      });
  });

  dispatcher('validateReferences', (dispatch, references) => {
    return post('/bookings/validate_references', { bookerReferences: references })
      .then(() => dispatch(action('validateReferencesSuccess', references)));
  });

  dispatcher('clearValidatedReferences', (dispatch) => {
    dispatch(action('clearValidatedReferences'));
  });
});

import { namespace } from 'js/redux';
import { get, put, post, destroy, RequestsValve } from 'utils';
import { isMobile } from 'utils/userAgent';
import { flightstatsDispatchers } from 'utils/flightstats';
import axios, { CancelToken } from 'axios';

export default namespace('bookings', (dispatcher, action) => {
  const valve = new RequestsValve;

  dispatcher('getBookings', (dispatch, query, update, setLoading) => {
    dispatch(action('getBookings', query, setLoading));

    return valve.whenReady(() => {
      // the seeming duplication is made on purpose: immediate dispatch of `getBookings`
      // action is needed to set new `query` in redux state, and also we need it here
      // to be able to `setLoading` when new request can be issued after previous
      // one has been resolved.
      dispatch(action('getBookings', query, setLoading));

      return get('/admin/bookings', query)
        .then((res) => {
          if (update) {
            dispatch(action('getBookingsSuccess', res.data));
          }

          return res.data;
        });
    });
  });

  dispatcher('getBookingItem', (dispatch, id) => {
    return get(`/admin/bookings/${id}`)
      .then((res) => {
        dispatch(action('getBookingItemSuccess', res.data));
      });
  });

  dispatcher('getBooking', (dispatch, id) => {
    dispatch(action('getBooking'));

    return get(`/admin/bookings/${id}`)
      .then((res) => {
        dispatch(action('getBookingSuccess', res.data));
        return res.data;
      });
  });

  dispatcher('cancelBooking', (dispatch, id, params = {}) => {
    return put(`/admin/bookings/${id}/cancel`, params)
      .then((res) => {
        // 'getBookingItemSuccess' is issued to update both table row and
        // booking details (if cancelled booking is expanded row)
        dispatch(action('getBookingItemSuccess', res.data));
      }).catch((err) => {
        return Promise.reject(err.response.data.errors.message);
      });
  });

  dispatcher('clearAlert', (dispatch, id, bookingId) => {
    return destroy(`/admin/alerts/${id}`)
      .then(() => {
        return dispatch(action('clearAlertSuccess', bookingId, id));
      });
  });

  dispatcher('getFormData', (dispatch, companyId, bookingId, bookingAction) => {
    const path = companyId
        ? `/admin/companies/${companyId}/bookings/new`
        : bookingId
          ? `/admin/bookings/${bookingId}/${bookingAction}`
          : '/bookings/new';

    return get(path)
      .then((res) => {
        dispatch(action('getFormDataSuccess', res.data));
        return res.data;
      });
  });

  // TODO: DRY with app/bookings.dispatcher.js
  let cancelGetFormDetails;

  dispatcher('getFormDetails', (dispatch, companyId, params) => {
    if (cancelGetFormDetails) {
      cancelGetFormDetails();
    } else {
      dispatch(action('getFormDetails', params));
    }

    const path = companyId
      ? `/admin/companies/${companyId}/bookings/form_details`
      : `/admin/bookings/${params.booking.id}/form_details`;

    return post(path, params, { cancelToken: new CancelToken(c => cancelGetFormDetails = c) })
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

  dispatcher('saveBooking', (dispatch, companyId, booking) => {
    booking = {
      ...booking,
      scheduledAt: booking.scheduledType === 'now' ? undefined : booking.scheduledAt.format(),
      sourceType: isMobile ? 'web_mobile' : 'web'
    };

    dispatch(action('saveBooking'));

    const request = companyId
      ? post(`/admin/companies/${companyId}/bookings`, booking)
      : booking.id
        ? put(`/admin/bookings/${booking.id}`, booking)
        : post('/admin/bookings', { ...booking, id: booking.repeat });

    return request
      .then((res) => {
        dispatch(action('saveBookingSuccess', res.data));
        return res.data;
      }).catch((err) => {
        dispatch(action('saveBookingFailure'));
        throw err;
      });
  });

  dispatcher('getReferenceEntries', (dispatch, referenceId, searchTerm) => {
    return get(`/admin/booking_references/${referenceId}/reference_entries`, { searchTerm })
      .then((res) => {
        dispatch(action('getReferenceEntriesSuccess', { referenceId, entries: res.data.items }));
      });
  });

  dispatcher('getPricing', (dispatch, bookingId) => {
    dispatch(action('getPricing'));

    return get(`/admin/bookings/${bookingId}/pricing`)
      .then((res) => {
        dispatch(action('getPricingSuccess', res.data));
      });
  });

  dispatcher('savePricing', (dispatch, bookingId, pricing) => {
    dispatch(action('savePricing'));

    return put(`/admin/bookings/${bookingId}/pricing`, { pricing })
      .then((res) => {
        dispatch(action('savePricingSuccess', res.data));
      });
  });

  dispatcher('getComments', (dispatch, bookingId) => {
    return get(`/admin/bookings/${bookingId}/comments`)
      .then(({ data }) => dispatch(action('getCommentsSuccess', data.items)));
  });

  dispatcher('addComment', (dispatch, bookingId, text) => {
    return post(`/admin/bookings/${bookingId}/comments`, { comment: { text } })
      .then(({ data }) => dispatch(action('addComment', data.comment)));
  });

  dispatcher('resendOrder', (dispatch, bookingId) => {
    return put(`/admin/bookings/${bookingId}/resend_order`);
  });

  dispatcher('getLog', (dispatch, query) => {
    return get(`/admin/bookings/${query.id}/log`)
      .then((res) => {
        dispatch(action('getLogSuccess', res.data));
      });
  });

  dispatcher('getReferences', (dispatch, companyId) => {
    return get(`/admin/companies/${companyId}/bookings/references`)
      .then((res) => {
        dispatch(action('getReferencesSuccess', res.data));

        return res.data;
      });
  });

  dispatcher('validateReferences', (dispatch, companyId, references = []) => {
    return post(`/admin/companies/${companyId}/bookings/validate_references`, { bookerReferences: references })
      .then(() => dispatch(action('validateReferencesSuccess', references)));
  });

  dispatcher('clearValidatedReferences', (dispatch) => {
    dispatch(action('clearValidatedReferences'));
  });

  dispatcher('toggleCriticalFlag', (dispatch, bookingId) => {
    return put(`/admin/bookings/${bookingId}/toggle_critical_flag`)
      .then((res) => {
        dispatch(action('getBookingSuccess', res.data));

        return res.data;
      });
  });
});

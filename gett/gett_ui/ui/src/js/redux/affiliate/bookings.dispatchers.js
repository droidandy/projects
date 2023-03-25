import dispatchers from '../app/bookings.dispatchers';
import { get, put } from 'utils';

export default dispatchers.update((dispatcher, action) => {
  dispatcher('removeBookingFromList', (dispatch, id) => {
    dispatch(action('removeBookingFromList', id));
  });

  dispatcher('getProducts', (dispatch, params) => {
    return get('/bookings/products', params);
  });

  dispatcher('cancelBooking', (dispatch, id) => {
    return put(`/bookings/${id}/cancel`)
      .then((res) => {
        dispatch(action('cancelBookingSuccess', { id, booking: res.data }));
      }).catch((err) => {
        return Promise.reject(err.response.data.errors.message);
      });
  });

  dispatcher('getCreatedBooking', (dispatch, id) => {
    return get(`/bookings/${id}`)
      .then((res) => {
        dispatch(action('getCreatedBookingSuccess', res.data));
      })
      .catch((err) => {
        // if faye picked up new booking, but it's not available for current
        // user, just swallow the error.
        if (err.response.status !== 401) {
          return Promise.reject(err);
        }
      });
  });

  dispatcher('getUpdatedBooking', (dispatch, id) => {
    return get(`/bookings/${id}`)
      .then((res) => {
        dispatch(action('getUpdatedBookingSuccess', res.data));
      });
  });

  dispatcher('getFormData', (dispatch) => {
    return get('/bookings/new')
      .then((res) => {
        dispatch(action('getFormDataSuccess', res.data));
        return res.data;
      });
  });
});

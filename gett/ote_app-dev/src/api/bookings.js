import { post, put, get } from 'utils';
import axios from 'axios';

const getFormDetails = (booking, params, onCancelToken = () => {}) => (
  post('/bookings/form_details', { booking, ...params }, { cancelToken: new axios.CancelToken(onCancelToken) })
    .then(res => res.data)
);

const rateBooking = (bookingId, data) => put(`/bookings/${bookingId}/rate`, data);

const cancelBooking = (bookingId, data) => put(`/bookings/${bookingId}/cancel`, data);

const sendCancellationReason = (bookingId, cancellationReason) => (
  put(`/bookings/${bookingId}/cancellation_reason`, { cancellationReason })
);

const updateBooking = (bookingId, data) => put(`/bookings/${bookingId}`, data);

const getBookings = params => get('/bookings', params);

const getBooking = bookingId => get(`/bookings/${bookingId}`);

const getInfoForNewBooking = () => get('/bookings/new');

const getInfoForCurrentEditBooking = bookingId => get(`/bookings/${bookingId}/edit`);

const createBooking = data => post('/bookings', data);

const validateReferences = bookerReferences => post('bookings/validate_references', { bookerReferences });

const searchBookingReferences = (bookingId, searchValue) => (
  get(`booking_references/${bookingId}/reference_entries?search_term=${searchValue}`)
);

export default {
  getFormDetails,
  rateBooking,
  cancelBooking,
  sendCancellationReason,
  updateBooking,
  getBookings,
  getBooking,
  getInfoForNewBooking,
  getInfoForCurrentEditBooking,
  createBooking,
  validateReferences,
  searchBookingReferences
};

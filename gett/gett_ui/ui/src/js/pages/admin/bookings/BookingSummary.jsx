import { connect } from 'react-redux';
import BookingSummary from 'pages/shared/bookings/BookingSummary';
import { subscribe } from 'utils';
import dispatchers from 'js/redux/admin/bookings.dispatchers';

function mapStateToProps(state, { match: { params: { id } }}) {
  return {
    bookingsChannel: state.app.bookingsChannel,
    booking: state.bookings.summary,
    id
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(subscribe('bookingsChannel', 'handleBookingUpdate')(BookingSummary));

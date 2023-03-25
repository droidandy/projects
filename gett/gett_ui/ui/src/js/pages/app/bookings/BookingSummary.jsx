import dispatchers from 'js/redux/app/bookings.dispatchers';
import { connect } from 'react-redux';
import { subscribe } from 'utils';
import BookingSummary from 'pages/shared/bookings/BookingSummary';

function mapStateToProps(state, { match: { params: { id } }}) {
  return {
    bookingsChannel: state.session.bookingsChannel,
    booking: state.bookings.summary,
    id
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(subscribe('bookingsChannel', 'handleBookingUpdate')(BookingSummary));

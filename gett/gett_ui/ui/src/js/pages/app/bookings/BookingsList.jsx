import BaseBookingsList from 'pages/shared/bookings/BookingsList';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { subscribe } from 'utils';
import dispatchers from 'js/redux/app/bookings.dispatchers';

import { activeStatuses, futureStatuses, processingStatuses, customerCareStatuses } from 'pages/shared/bookings/data';

function mapStateToProps(state, ownProps) {
  const { can, match: { path, params: { id } } } = ownProps;

  return {
    ...state.bookings.list,
    isReportsPage: /^\/reports\//.test(path),
    bookingsChannel: state.session.bookingsChannel,
    expandedId: +id,
    can: { ...can, exportBookings: state.session.can.exportBookings, exportReceipts: state.session.can.exportReceipts }
  };
}

class BookingsList extends BaseBookingsList {
  static propTypes = {
    ...BaseBookingsList.propTypes,
    cancelBooking: PropTypes.func,
    rateBooking: PropTypes.func,
    saveFeedback: PropTypes.func
  };

  static defaultProps = {
    // in Front Office, "Active Bookings" also include future, 'processing' and 'customer_care' orders
    defaultStatuses: [...futureStatuses, ...activeStatuses, ...processingStatuses, ...customerCareStatuses],
    emptyText: 'You haven\'t got any active bookings.'
  };

  rateBooking = (booking, rating) => {
    return this.props.rateBooking(booking.id, rating);
  };

  saveFeedback = (booking, feedback) => {
    return this.props.saveFeedback(booking.id, feedback);
  };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(
  subscribe('bookingsChannel', 'handleBookingUpdate')(BookingsList)
);

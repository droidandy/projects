import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChangeLog } from 'components';
import dispatchers from 'js/redux/admin/bookings.dispatchers';

function mapStateToProps(state) {
  return { items: state.bookings.changeLog };
}

class BookingChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    bookingId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    getLog: PropTypes.func
  };

  render() {
    const { bookingId, getLog, items } = this.props;

    return <ChangeLog id={ bookingId } getLog={ getLog } items={ items } />;
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookingChangeLog);

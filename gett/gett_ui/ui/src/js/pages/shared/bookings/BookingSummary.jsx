import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Spin } from 'antd';
import BookingTable from './components/BookingTable';
import { notification } from 'components';

import css from './style.css';

export default class BookingSummary extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    bookingsChannel: PropTypes.string,
    booking: PropTypes.object,
    getBooking: PropTypes.func,
    backOffice: PropTypes.bool,
    id: PropTypes.string,
    cancelBooking: PropTypes.func,
    getPricing: PropTypes.func,
    savePricing: PropTypes.func
  };

  componentDidMount() {
    this.props.getBooking(this.props.id)
      .catch(() => notification.error('Booking not found'));
  }

  handleBookingUpdate({ bookingId }) {
    const { id, getBooking } = this.props;

    if (id == bookingId) {
      getBooking(id);
    }
  }

  render() {
    if (isEmpty(this.props.booking)) {
      return <div className="text-center mt-20"><Spin size="large" /></div>;
    }

    const { booking, cancelBooking, getPricing, savePricing } = this.props;

    return (
      <div className="p-20 sm-p-0">
        <BookingTable
          className={ `table-expandable sm-table-fixed ${css.tableSummary}` }
          expandedId={ booking.id }
          items={ booking }
          bookingDetails={ {
            onCancel: cancelBooking,
            onShowPricing: getPricing,
            onSavePricing: savePricing
          } }
        />
      </div>
    );
  }
}

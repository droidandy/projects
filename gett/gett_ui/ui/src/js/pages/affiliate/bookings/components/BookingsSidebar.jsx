import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import GoogleMap, { Marker } from 'components/GoogleMap';
import { Indicator, Desktop } from 'components';
import BookingDetails from './BookingDetails';
import { isEmpty, isEqual, find, without, forEach } from 'lodash';
import { subscribe } from 'utils';
import { statusLabels } from 'pages/shared/bookings/data';
import bookingsDispatchers from 'js/redux/affiliate/bookings.dispatchers';
import driversDispatchers from 'js/redux/app/drivers.dispatchers';

import css from './Bookings.css';

const supportPhone = '0207 788 8987';

function mapStateToProps(state) {
  return {
    items: state.bookings.list.items,
    companyName: state.session.layout.companyName,
    address: state.session.layout.address,
    bookingsChannel: state.session.bookingsChannel,
    driversChannel: state.drivers.channel
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bookingsDispatchers.mapToProps(dispatch),
    ...driversDispatchers.mapToProps(dispatch)
  };
}

const finalBookingRemovalDelay = 120000; // bookings with final status have to be deleted from list after 2 minutes

class BookingsSidebar extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    getBookings: PropTypes.func,
    companyName: PropTypes.string,
    address: PropTypes.object,
    bookingsChannel: PropTypes.string,
    driversChannel: PropTypes.string,
    removeBookingFromList: PropTypes.func,
    getUpdatedBooking: PropTypes.func,
    getCreatedBooking: PropTypes.func,
    cancelBooking: PropTypes.func,
    getDriversChannel: PropTypes.func,
    drivers: PropTypes.array
  };

  state = {
    updatedBookings: [],
    drivers: []
  };

  componentDidMount() {
    this.props.getBookings({ notFinal: true, reverse: true }, true);
    this.props.getDriversChannel();
  }

  componentDidUpdate(prevProps) {
    const { items } = this.props;

    if (!isEqual(prevProps, this.props)) {
      forEach(items, (item) => {
        if (item.final && !(item.id in this.removalTimeouts)) {
          this.removalTimeouts[item.id] = setTimeout(() => {
            prevProps.removeBookingFromList(item.id);
          }, finalBookingRemovalDelay);
        }
      });
    }
  }

  removalTimeouts = {};

  handleBookingUpdate({ bookingId, action }) {
    if (action === 'created') {
      this.props.getCreatedBooking(bookingId);
    } else {
      const { items, getUpdatedBooking } = this.props;

      if (find(items, { id: bookingId })) {
        getUpdatedBooking(bookingId)
          .then(() => this.setState({ updatedBookings: this.state.updatedBookings.concat(bookingId) }));
      }
    }
  }

  handleDriversUpdate({ drivers, diesIn }) {
    this.setState({ drivers });

    if (diesIn < 6) {
      // send a request to update channel's `valid_until` property to keep it alive
      this.props.getDriversChannel();
    }
  }

  touchBooking(id) {
    this.setState({ updatedBookings: without(this.state.updatedBookings, id) });
  }

  getPassengerDetails(item) {
    const { passenger, room } = item;

    if (passenger) return passenger;
    if (room) return `Room: ${room}`;

    return `Company: ${this.props.companyName}`;
  }

  renderGoogleMap() {
    const address = this.props.address;
    const drivers = this.state.drivers;

    return (
      <GoogleMap
        className="center-block mb-10 shrink-0"
        center={ address }
        width="100%"
        height="40%"
        style={ { minHeight: 200 } }
      >
        <Marker position={ address } icon="affiliate-start" title={ address.line } />
        { drivers.map(driver =>
            <Marker key={ driver.id } positions={ driver.locations } icon="driver" color="#249cff" />
          )
        }
      </GoogleMap>
    );
  }

  render() {
    const { address, items, cancelBooking } = this.props;
    const { updatedBookings } = this.state;

    return (
      <div className={ `${css.sidebar} p-10 layout vertical` }>
        { !isEmpty(address) && this.renderGoogleMap() }
        <div className={ `flex layout vertical ${css.list}` } data-name="bookingsList">
          <div className="flex scroll-box">
            { isEmpty(items) &&
              <p className="layout vertical center-center full-height white-text">
                No Active Orders
              </p>
            }
            { items.map(item => (
              <BookingDetails
                key={ item.id }
                booking={ item }
                passengerDetails={ this.getPassengerDetails(item) }
                cancelBooking={ cancelBooking }
              >
                <div
                  className={ `layout horizontal center white-text bold-text p-5 pl-25 pr-15 mb-10 pointer relative ${ item.final ? css.listItemGrey : css.listItemWhite }` }
                  onClick={ () => this.touchBooking(item.id) }
                  data-name="booking"
                >
                  { updatedBookings.includes(item.id) && !item.final && <Indicator /> }
                  <div className="text-center flex">
                    { item.orderId } - { statusLabels[item.status] } - { this.getPassengerDetails(item) }
                  </div>
                </div>
              </BookingDetails>
            )) }
          </div>
          <div className="flex none white-text text-center pt-10">
            <div>Customer Support</div>
            <Desktop>
              { matches => matches
                ? <div className="text-12">{ supportPhone }</div>
                : <a href={ `tel:${supportPhone}` } className="text-12 white-text">{ supportPhone }</a>
              }
            </Desktop>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  subscribe({
    bookingsChannel: 'handleBookingUpdate',
    driversChannel: 'handleDriversUpdate'
  })(BookingsSidebar)
);

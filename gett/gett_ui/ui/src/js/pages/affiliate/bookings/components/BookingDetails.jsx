import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, DriverInfo, Button, Indicator } from 'components';
import GoogleMap, { Marker, Polyline } from 'components/GoogleMap';
import { Popover } from 'antd';
import { notification, PhoneNumber, confirm } from 'components';
import { statusLabels } from 'pages/shared/bookings/data';
import moment from 'moment';

import css from './Bookings.css';

export default class BookingDetails extends PureComponent {
  static propTypes = {
    booking: PropTypes.object,
    passengerDetails: PropTypes.string,
    children: PropTypes.node,
    cancelBooking: PropTypes.func
  };

  static defaultProps = {
    booking: {}
  };

  state = {
    visible: false,
    loading: false
  };

  hide = () => {
    this.setState({ visible: false });
  };

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  };

  cancelOrder = () => {
    const { booking, cancelBooking } = this.props;

    confirm({
      title: 'Cancel Order',
      content: 'Are you sure you want to cancel your booking? The driver will no longer pick your passenger(s) up',
      cancelText: 'No',
      okText: 'Yes',
      onOk: () => {
        this.setState({ loading: true });
        cancelBooking(booking.id)
          .then(() => {
            this.setState({ loading: false });
            notification.success('Order is cancelled', 5);
          })
          .catch((error) => {
            this.setState({ loading: false });
            notification.error(`Order isn't cancelled. ${error}`, 5);
          });
      }
    });
  };

  renderContent() {
    const { booking, passengerDetails } = this.props;
    const { info, distance = {}, eta } = booking.driverDetails || {};
    const driverLocation = booking.driverDetails && booking.driverDetails.location;

    return (
      <div data-name="rideDetailsPopup">
        <div className="layout horizontal text-30 lh-1 bold-text mb-10">
          <Icon icon="FaTimesCircle" onClick={ this.hide } className="pointer mr-5" data-name="closeRideDetails" />
          Ride Details
        </div>
        <div className="layout horizontal">
          <div className="flex mr-10">
            <div className={ `${css.borderBlock} p-5 br-5 lh-1 bold-text` }>
              <div className={ `layout horizontal ${css.borderBottom} pb-5 mb-5 pb-5` }>
                <div className={ `${css.borderRight} pr-10` }>
                  <div className="text-9 mb-5">Order ID</div>
                  <div data-name="orderId">{ booking.orderId }</div>
                </div>
                <div className={ `${css.borderRight} pr-10 pl-10 nowrap` }>
                  <div className="text-9 mb-5">Status</div>
                  <div data-name="status">{ statusLabels[booking.status] }</div>
                </div>
                <div className="pr-10 pl-10">
                  <div className="text-9 mb-5">Ride type</div>
                  <div data-name="vehicleType">{ booking.vehicleType }</div>
                </div>
              </div>
              <div className={ `layout horizontal ${css.borderBottom} mb-5 pb-5` }>
                <div className={ `${css.borderRight} flex pr-10` }>
                  <div className="text-9 mb-5">Payment Method</div>
                  <div data-name="paymentMethod">{ booking.paymentMethodTitle || 'Cash' }</div>
                </div>
                { booking.scheduledAt &&
                  <div className="pl-10 flex">
                    <div className="text-9 mb-5">Pickup time</div>
                    <div data-name="pickupTime">{ moment(booking.scheduledAt).format('DD/MM/YYYY HH:mm') }</div>
                  </div>
                }
              </div>
              <div className={ `${css.borderBottom} mb-5 pb-5` }>
                <div className="text-9 mb-5">Pickup</div>
                <div data-name="pickupAddress">{ booking.pickupAddress.line }</div>
              </div>
              <div className={ `${css.borderBottom} mb-5 pb-5` }>
                <div className="text-9 mb-5">Destination</div>
                <div data-name="destinationAddress">{ booking.destinationAddress && booking.destinationAddress.line }</div>
              </div>
              <div className={ `${css.borderBottom} mb-5 pb-5` }>
                <div className="text-9 mb-5">Name and Phone</div>
                <div data-name="nameAndPhone">
                  { passengerDetails },
                  <PhoneNumber phone={ booking.phone } />
                </div>
              </div>
              <div>
                <div className="text-9 mb-5">Message to driver</div>
                <div data-name="messageToDriver">{ booking.message }</div>
              </div>
            </div>
            { !['locating', 'order_received', 'creating'].includes(booking.status) && booking.driverDetails &&
              <DriverInfo className={ `${css.borderBlock} br-5 p-5 mt-20` } driver={ info } />
            }
          </div>
          <div className="flex layout vertical">
            { ['on_the_way', 'arrived', 'in_progress', 'completed'].includes(booking.status) &&
              <GoogleMap
                className="center-block mb-10 shrink-0"
                fitBounds
                width="100%"
                height={ 300 }
                followPoint={ !booking.final && driverLocation }
              >
                <Marker key="pickup" position={ booking.pickupAddress } icon="affiliate-start" title={ booking.pickupAddress.line } />
                { booking.destinationAddress && <Marker key="destination" position={ booking.destinationAddress } icon="finish" title={ booking.destinationAddress.line } /> }
                { !booking.final && driverLocation && <Marker key="driver" position={ driverLocation } icon="driver" title="Driver" /> }
                { booking.path && booking.path.length > 0 && <Polyline key="path" path={ booking.path } /> }
              </GoogleMap>
            }
            { booking.status === 'on_the_way' && booking.vehicleType !== 'carey' &&
              <div className="layout horizontal end white-bg br-15 p-10 mb-10 yellow-text bold-text">
                <div className="flex mr-5">
                  <div className="text-uppercase mb-5">ETA</div>
                  <div
                    className="text-20 layout horizontal end yellow-bg white-text br-5 pt-5 pl-10 pr-10">
                    <span className="text-40 lh-1 mr-5">{ eta || 'N/A' }</span>min
                  </div>
                </div>
                <div className="flex">
                  <div className="text-uppercase mb-5">Estimated Distance</div>
                  <div
                    className="text-20 layout horizontal end yellow-bg white-text br-5 pt-5 pl-10 pr-10">
                    <span className="text-40 lh-1 mr-5">{ distance.value || '00.0' }</span>{ distance.unit || 'mi' }
                  </div>
                </div>
              </div>
            }

            { ['locating', 'order_received', 'creating'].includes(booking.status) &&
              <div className={ `${css.borderBlock} ${css.max175} br-5 p-5 flex layout horizontal center-center` }>
                <div>
                  <Indicator size={ 50 } className="center-block" />
                  <div className="text-18 text-uppercase text-center mt-10">{ statusLabels[booking.status] }</div>
                </div>
              </div>
            }
            { booking.can.cancel &&
              <Button
                onClick={ this.cancelOrder }
                loading={ this.state.loading }
                type="secondary"
                className="mt-10"
                data-name="cancelOrder"
              >
                Cancel Order
              </Button>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <Popover
        content={ this.renderContent() }
        placement="left"
        transitionName="zoom-right"
        trigger="click"
        visible={ this.state.visible }
        onVisibleChange={ this.handleVisibleChange }
        overlayClassName={ css.popover }
      >
         { this.props.children }
       </Popover>
    );
  }
}

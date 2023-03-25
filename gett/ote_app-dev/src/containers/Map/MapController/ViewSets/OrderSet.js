import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import { getBooking } from 'actions/booking';
import { changeCoordinatesToResize, changeRegionToAnimate } from 'actions/ui/map';

import { withTheme } from 'theme';

import { prepareCoordinates, preparePointsListCoordinates, getStops, areAddressesEqual, formatETA } from 'utils';
import {
  IN_PROGRESS_STATUS,
  ACTIVE_DRIVER_STATUSES,
  ARRIVED_STATUS,
  FINAL_STATUSES,
  ORDER_RECEIVED_STATUS,
  DRIVER_ON_WAY,
  POINTER_DISPLAY_STATUSES
} from 'utils/orderStatuses';

import { DriverRoute, OrderRoute, RandomRoutes } from '../Routes';
import { SourceActiveMarker } from '../Markers';

class OrderSet extends React.Component {
  static propTypes = {
    changeCoordinatesToResize: PropTypes.func,
    changeRegionToAnimate: PropTypes.func,
    devSettings: PropTypes.object,
    getBooking: PropTypes.func,
    isCompletedOrder: PropTypes.bool,
    onFutureOrderAcceptedReceive: PropTypes.func,
    order: PropTypes.object.isRequired
  };

  state = {
    loading: false
  }

  setDriverRef = (driverRoute) => { this.driverRoute = driverRoute; };

  componentDidMount() {
    if (this.shouldShowOrderPath(this.props.order)) {
      this.resizeMapToOrderRoute();
    }

    this.resizeMapOnOpenOrder();
  }

  componentDidUpdate({ order: oldOrder, isCompletedOrder: isCompletedOldOrder }) {
    const { isCompletedOrder } = this.props;

    if (isCompletedOrder && !isCompletedOldOrder) {
      this.resizeMapToOrderRoute();
    } else if (!isCompletedOrder) {
      this.resizeMapOnActiveOrderChange({ oldOrder });
    }
  }

  shouldResizeMapToDriverAndPickupAddress = ({ oldOrder, order }) => (
    order.pickupAddress && order.driverDetails && order.driverDetails.location &&
    ((this.gotNewStatus(oldOrder, order, DRIVER_ON_WAY)) ||
      (this.gotNewStatus(oldOrder, order, ARRIVED_STATUS)))
  );

  shouldResizeMapToDriverAndDestinationAddress = ({ oldOrder, order }) => (
    order.destinationAddress && order.driverDetails && order.driverDetails.location &&
      this.gotNewStatus(oldOrder, order, IN_PROGRESS_STATUS)
  );

  shouldShowDriverMarker = order => (
    order.driverDetails && order.driverDetails.location &&
    (ACTIVE_DRIVER_STATUSES.includes(order.indicatedStatus) || order.indicatedStatus === IN_PROGRESS_STATUS)
  );

  shouldShowOrderPath = order => (
    this.isCompletedOrderStatus(order) ||
      (order.indicatedStatus === ORDER_RECEIVED_STATUS && !order.asap) ||
      (order.indicatedStatus === DRIVER_ON_WAY && order.driverDetails && !order.driverDetails.location)
  );

  shouldShowPickupMarker = order => (
    order.indicatedStatus === IN_PROGRESS_STATUS || (!order.destinationAddress &&
      (!POINTER_DISPLAY_STATUSES.includes(order.indicatedStatus) ||
      (order.indicatedStatus === ORDER_RECEIVED_STATUS && !order.asap)))
  );

  resizeMapOnOpenOrder = () => {
    const { order, changeRegionToAnimate } = this.props;
    const { indicatedStatus, asap } = order;

    if ((indicatedStatus === DRIVER_ON_WAY || indicatedStatus === ARRIVED_STATUS) &&
      this.shouldShowDriverMarker(order)) {
      this.resizeMapToDriverAndTargetAddress('pickup', order);
    }

    if (indicatedStatus === IN_PROGRESS_STATUS && this.shouldShowDriverMarker(order)) {
      this.resizeMapToDriverAndTargetAddress('destination', order);
    }

    if ((indicatedStatus === ORDER_RECEIVED_STATUS && asap) || POINTER_DISPLAY_STATUSES.includes(indicatedStatus)) {
      changeRegionToAnimate(order.pickupAddress);
    }
  };

  isStopsChanged = (order, oldOrder) => (
    !isEqual(getStops(order).map(s => s.line || s.address.line), getStops(oldOrder).map(s => s.line || s.address.line))
  );

  isPathChanged = (order, oldOrder) => (
    !areAddressesEqual(order.pickupAddress, oldOrder.pickupAddress) ||
    (order.destinationAddress && !areAddressesEqual(order.destinationAddress, oldOrder.destinationAddress)) ||
    (getStops(order) && this.isStopsChanged(order, oldOrder))
  );

  resizeMapOnActiveOrderChange = ({ oldOrder }) => {
    const { order } = this.props;
    const { indicatedStatus } = order;

    if (this.shouldResizeMapToDriverAndPickupAddress({ oldOrder, order })) {
      this.resizeMapToDriverAndTargetAddress('pickup', order);
    }

    if (this.shouldResizeMapToDriverAndDestinationAddress({ oldOrder, order })) {
      this.resizeMapToDriverAndTargetAddress('destination', order); // TODO: need to resize to stops too
    }

    if ((indicatedStatus !== oldOrder.indicatedStatus && indicatedStatus === ORDER_RECEIVED_STATUS && !order.asap)) {
      this.props.onFutureOrderAcceptedReceive();
      this.resizeMapToOrderRoute();
    }

    if (this.isPathChanged(order, oldOrder)) {
      this.resizeMapToOrderRoute();
    }
  };

  resizeMapToDriverAndTargetAddress = (type, order) => {
    const dest = prepareCoordinates(order[`${type}Address`]);
    const source = prepareCoordinates(order.driverDetails.location);

    setTimeout(() => {
      if (source) {
        this.props.changeCoordinatesToResize([source, dest]);
      } else {
        this.props.changeRegionToAnimate(dest);
      }
    });
  };

  resizeMapToOrderRoute = () => {
    const { source, dest, stops } = preparePointsListCoordinates(this.props.order);

    setTimeout(() => this.props.changeCoordinatesToResize([source, dest, ...stops]));
  };

  gotNewStatus = (oldOrder, order, status) => oldOrder.indicatedStatus !== status && order.indicatedStatus === status;

  isCompletedOrderStatus = order => FINAL_STATUSES.includes(order.indicatedStatus);

  updateDriverLocation = () => {
    const { order, getBooking } = this.props;

    if (this.shouldShowDriverMarker(order) && this.driverRoute) {
      this.setState({ loading: true });

      getBooking(order.id).then(({ data }) => {
        this.setState({ loading: false }, () => {
          this.driverRoute.processNewCoords([data.driverDetails?.location]);
        });
      });
    }
  }

  renderDriverRoutes = () => {
    const { order } = this.props;

    const destinationTypes = {
      [ARRIVED_STATUS]: 'source',
      [IN_PROGRESS_STATUS]: 'etaDestination',
      [DRIVER_ON_WAY]: 'eta'
    };

    const destinationAddress = order.indicatedStatus === IN_PROGRESS_STATUS
      ? order.destinationAddress
      : order.pickupAddress;
    const { location, eta } = order.driverDetails || {};

    const sources = (order.driverPath?.length && order.driverPath) || order.path || [];

    return this.shouldShowDriverMarker(order) && !this.state.loading
      ? (
        <DriverRoute
          innerRef={this.setDriverRef}

          destinationType={destinationTypes[order.indicatedStatus]}
          initialPosition={prepareCoordinates(location)}
          source={sources}
          destination={{ ...destinationAddress, value: formatETA(eta) }}
          stops={order.stops || order.stopAddresses}
          routeHidden={[DRIVER_ON_WAY, ARRIVED_STATUS].includes(order.indicatedStatus)}
          areStopsAvailable={order.indicatedStatus === IN_PROGRESS_STATUS}
          carType={order.vehicleType}
        />
      )
      : null;
  }

  render() {
    const { order, devSettings } = this.props;

    return (
      <Fragment>
        {this.renderDriverRoutes()}

        {this.shouldShowOrderPath(order) && order.destinationAddress &&
          <OrderRoute
            source={order.pickupAddress}
            destination={order.destinationAddress}
            stops={order.stops || order.stopAddresses || []}
            path={order.path}
          />
        }

        {this.shouldShowPickupMarker(order) && <SourceActiveMarker coordinate={order.pickupAddress} />}

        {devSettings.showLocatingCarAnimation && <RandomRoutes order={order} />}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ app, booking }) => ({
  devSettings: app.devSettings,
  vehiclesData: booking.vehiclesData
});

const mapDispatchToProps = {
  changeCoordinatesToResize,
  changeRegionToAnimate,
  getBooking
};

export default connect(mapStateToProps, mapDispatchToProps, null)(withTheme(OrderSet));

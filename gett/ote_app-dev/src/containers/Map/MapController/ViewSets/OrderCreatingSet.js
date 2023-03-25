import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import {
  changeRegionToAnimate,
  changeCoordinatesToResize,
  getDriversLocations,
  subscribeToDriversLocations
} from 'actions/ui/map';
import { changeAddress } from 'actions/booking';

import { withTheme } from 'theme';

import { preparePointsListCoordinates } from 'utils';

import { DriversMarkers } from '../Markers';

import { OrderRoute } from '../Routes';

const pollingInterval = 45 * 1000;

class OrderCreatingSet extends React.Component {
  static propTypes = {
    changeAddress: PropTypes.func,
    changeCoordinatesToResize: PropTypes.func,
    changeRegionToAnimate: PropTypes.func,
    currentPosition: PropTypes.object,
    defaultPickup: PropTypes.object,
    devSettings: PropTypes.object,
    dragEnable: PropTypes.bool,
    drivers: PropTypes.array,
    getDriversLocations: PropTypes.func,
    onEndLoadingPickup: PropTypes.func,
    order: PropTypes.object.isRequired,
    subscribeToDriversLocations: PropTypes.func,
    theme: PropTypes.object,
    vehiclesData: PropTypes.object
  };

  componentDidUpdate({ order: oldOrder, dragEnable: oldDragEnable }) {
    const { order, changeCoordinatesToResize, onEndLoadingPickup, dragEnable, devSettings } = this.props;

    if (this.isPickupAddressWasUpdatedByMapDrag({ order, dragEnable, oldDragEnable, oldOrder })) {
      onEndLoadingPickup();
    } else if (this.shouldAnimateToPickUp({ order, oldOrder })) {
      this.handleAnimateToRegion();
    }

    if (this.isPathChanged(order, oldOrder)) {
      const { source, dest, stops } = preparePointsListCoordinates(order);
      setTimeout(() => changeCoordinatesToResize([source, dest, ...stops]));
    }

    if (devSettings.showCarAnimations && this.shouldGetDriversLocations({ order, oldOrder })) {
      this.getDriversLocations(order.pickupAddress);
    }
  }

  componentWillUnmount() {
    clearInterval(this.getDriversInterval);
  }

  getDriversLocations = (pickupAddress) => {
    clearInterval(this.getDriversInterval);

    this.props.getDriversLocations(pickupAddress);
    this.props.subscribeToDriversLocations(pickupAddress);

    this.getDriversInterval = setInterval(() => {
      const pickUpAddress = this.props.order.pickupAddress;

      this.props.subscribeToDriversLocations(pickUpAddress);
    }, pollingInterval);
  };

  isPathChanged = (order, oldOrder) => (
    !order.id && !oldOrder.id &&
    (order.pickupAddress && order.destinationAddress) && (
      (order.pickupAddress && !isEqual(order.pickupAddress, oldOrder.pickupAddress)) ||
      (order.destinationAddress && !isEqual(order.destinationAddress, oldOrder.destinationAddress)) ||
      (order.stops && !isEqual(order.stops, oldOrder.stops))
    )
  );

  shouldAnimateToPickUp = ({ order, oldOrder }) => (
    (!isEqual(order.pickupAddress, oldOrder.pickupAddress) && !order.destinationAddress) ||
    (!order.destinationAddress && oldOrder.destinationAddress)
  );

  shouldGetDriversLocations = ({ order, oldOrder }) => (
    order.pickupAddress && order.pickupAddress !== oldOrder.pickupAddress
  );

  isPickupAddressWasUpdatedByMapDrag = ({ order, dragEnable, oldDragEnable, oldOrder }) => (
    !dragEnable && !oldDragEnable && !isEqual(order.pickupAddress, oldOrder.pickupAddress) && order.pickupAddress
  );

  handleAnimateToRegion = () => {
    const { order, currentPosition, defaultPickup, changeRegionToAnimate } = this.props;

    changeRegionToAnimate(order.pickupAddress || currentPosition || defaultPickup);
  };

  render() {
    const { order, vehiclesData: { duration, distance }, drivers, theme, devSettings } = this.props;

    return (
      <Fragment>
        {!order.destinationAddress && devSettings.showCarAnimations &&
          <DriversMarkers drivers={drivers} nightMode={theme.isNightMode} />
        }
        {order.destinationAddress &&
          <OrderRoute
            sourceType={duration ? 'journey' : 'default'}
            destinationType={distance ? 'distance' : 'default'}
            source={{ ...order.pickupAddress, value: duration }}
            destination={{ ...order.destinationAddress, value: distance }}
            stops={order.stops || order.stopAddresses}
          />
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ({ app, ui, booking }) => ({
  currentPosition: ui.map.currentPosition,
  devSettings: app.devSettings,
  drivers: ui.map.drivers,
  vehiclesData: booking.vehiclesData,
  defaultPickup: booking.formData.defaultPickupAddress
});

const mapDispatchToProps = {
  changeCoordinatesToResize,
  changeRegionToAnimate,
  getDriversLocations,
  subscribeToDriversLocations,
  changeAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(OrderCreatingSet));

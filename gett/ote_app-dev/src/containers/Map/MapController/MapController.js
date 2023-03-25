import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isNull, debounce } from 'lodash';
import { AppState } from 'react-native';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

import { AVAILABLE_MAP_SCENES } from 'actions/ui/navigation';
import { changeAddress } from 'actions/booking';
import { changePosition, changeRegionToAnimate, trackUserLocation } from 'actions/ui/map';
import {
  checkMultiplePermissions,
  requestLocation,
  locationPermissions,
  PERMISSION_STATUS
} from 'actions/app/statuses';
import { postEvent } from 'actions/app/gett';

import { strings } from 'locales';

import {
  Location,
  prepareCoordinates,
  didRestoreFromBackground,
  geoLocationOptions,
  isAndroid,
  showInfoAlert
} from 'utils';

import { OrderSet, OrderCreatingSet } from './ViewSets';

import MapView from './MapView';

class MapController extends React.PureComponent {
  static propTypes = {
    activeBookingId: PropTypes.number,
    activeScene: PropTypes.string,
    allowAutomationPickupChange: PropTypes.bool,
    bookingForm: PropTypes.object,
    changeAddress: PropTypes.func,
    changePosition: PropTypes.func,
    changeRegionToAnimate: PropTypes.func,
    checkMultiplePermissions: PropTypes.func,
    currentOrder: PropTypes.object,
    currentPosition: PropTypes.object,
    defaultPickupAddress: PropTypes.object,
    onFutureOrderAcceptedReceive: PropTypes.func,
    permissions: PropTypes.object,
    postEvent: PropTypes.func,
    requestLocation: PropTypes.func,
    trackUserLocation: PropTypes.func
  };

  state = {
    dragEnable: true,
    isLoadingPickup: false,
    message: strings('alert.message.notReceivedCoordinates')
  };

  appState = 'active';

  setOrderSetRef = (el) => { this.orderSet = el; };

  componentDidMount() {
    const { permissions, currentPosition, requestLocation, changeRegionToAnimate } = this.props;

    if (permissions.location === PERMISSION_STATUS.undetermined) {
      requestLocation();
    }

    AppState.addEventListener('change', this.handleAppStateChange);

    if (locationPermissions.includes(permissions.location) && currentPosition) {
      changeRegionToAnimate(currentPosition);
    }
  }

  componentDidUpdate({ currentPosition: oldPosition, permissions: oldPermissions }) {
    const { currentPosition, activeBookingId, changeRegionToAnimate, permissions } = this.props;
    const { denied, undetermined } = PERMISSION_STATUS;

    if (currentPosition && isNull(oldPosition) && !activeBookingId) {
      changeRegionToAnimate(currentPosition);
    }

    if (permissions.location === denied && oldPermissions.location === undetermined) {
      showInfoAlert({ message: strings('alert.message.notReceivedCoordinates'), type: 'warning' });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  trackUserLocation = debounce(() => {
    this.props.trackUserLocation();
  }, geoLocationOptions.timeout);

  handleAppStateChange = (nextAppState) => {
    const isBackFromBackground = didRestoreFromBackground(this.appState, nextAppState);

    if (isBackFromBackground && !this.getOrder().destinationAddress) {
      this.props.checkMultiplePermissions(['location']).then(({ location }) => {
        const authorized = location === PERMISSION_STATUS.authorized;

        if (!authorized) {
          showInfoAlert({ message: strings('alert.message.notReceivedCoordinates'), type: 'warning' });
          return;
        }

        if (this.props.allowAutomationPickupChange) this.getNavigatorLocation();
      });
    }

    if (isBackFromBackground) {
      this.props.postEvent('app_back_from_background');
      this.trackUserLocation();

      if (this.orderSet) this.orderSet.updateDriverLocation();
    }

    this.appState = nextAppState;
  };

  getNavigatorLocation = (onLoadCoordinate = this.changePosition) => (
    Location.getNavigatorLocation(onLoadCoordinate, this.props.changeAddress, this.handleGeocodeError)
  );

  checkLocationServicesIsEnabled = () => (
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: strings('popup.gpsService.title'),
      ok: strings('popup.gpsService.button.ok'),
      cancel: strings('popup.gpsService.button.no'),
      enableHighAccuracy: true,
      showDialog: true,
      openLocationServices: true,
      preventOutSideTouch: false,
      preventBackClick: false,
      providerListener: false
    })
  );

  getCurrentPosition = async ({ checkGPSEnabling = false, shouldRequestPermission = true } = {}) => {
    if (isAndroid && checkGPSEnabling) {
      await this.checkLocationServicesIsEnabled();
    }

    if (!shouldRequestPermission && this.props.permissions.location === PERMISSION_STATUS.denied) {
      return this.handleGeocodeError();
    }

    return this.getNavigatorLocation((coordinates) => {
      this.changePosition(coordinates);
      this.props.changeRegionToAnimate(coordinates);
    });
  };

  changePosition = (coords) => {
    const { currentPosition, currentOrder } = this.props;
    const { latitude, longitude } = currentPosition || {};

    const coordinates = prepareCoordinates(coords);

    if (coordinates && (coordinates.latitude !== latitude || coordinates.longitude !== longitude) && !currentOrder.id) {
      this.props.changePosition({ ...coords, ...coordinates });
      this.trackUserLocation();
    }
  };

  handleGeocodeError = () => {
    const { bookingForm, defaultPickupAddress } = this.props;
    const address = bookingForm.pickupAddress || defaultPickupAddress;

    this.props.changeAddress(address, { type: 'pickupAddress' });
  };

  getOrder(props = this.props) {
    return props.currentOrder.id ? props.currentOrder : props.bookingForm;
  }

  isActiveSceneIs = (name = 'orderCreating') => this.props.activeScene === AVAILABLE_MAP_SCENES[name];

  disableDrag = () => {
    this.setState({ dragEnable: false });
  };

  enableDrag = () => {
    this.setState({ dragEnable: true });
  };

  startLoadingPickup = () => {
    this.setState({ isLoadingPickup: true });
  };

  endLoadingPickup = () => {
    this.setState({ isLoadingPickup: false });
  };

  resizeMapToDriverAndTargetAddress = (type, order) => {
    this.orderSet.resizeMapToDriverAndTargetAddress(type, order);
  };

  render() {
    const { dragEnable, isLoadingPickup } = this.state;
    const { onFutureOrderAcceptedReceive } = this.props;
    const isOrderCreating = this.isActiveSceneIs('orderCreating');
    const isCompletedOrder = this.isActiveSceneIs('completedOrder');
    const order = this.getOrder();

    return (
      <MapView
        isOrderCreating={isOrderCreating}
        order={order}
        dragEnable={!isLoadingPickup && dragEnable}
        enableDrag={this.enableDrag}
        disableDrag={this.disableDrag}
        onStartLoadingPickup={this.startLoadingPickup}
        onEndLoadingPickup={this.endLoadingPickup}
        onChangePosition={this.changePosition}
      >
        {isOrderCreating && !order.id &&
          <OrderCreatingSet
            order={order}
            dragEnable={!isLoadingPickup && dragEnable}
            onEndLoadingPickup={this.endLoadingPickup}
          />
        }
        {!isOrderCreating && order.id &&
          <OrderSet
            innerRef={this.setOrderSetRef}
            order={order}
            isCompletedOrder={isCompletedOrder}
            disableDrag={this.disableDrag}
            onFutureOrderAcceptedReceive={onFutureOrderAcceptedReceive}
          />
        }
      </MapView>
    );
  }
}


const mapStateToProps = ({ ui, booking, app, session }) => ({
  activeBookingId: session?.user?.activeBookingId,
  activeScene: ui.navigation.activeScene,
  allowAutomationPickupChange: booking.allowAutomationPickupChange,
  bookingForm: booking.bookingForm,
  currentOrder: booking.currentOrder,
  currentPosition: ui.map.currentPosition,
  defaultPickupAddress: booking.formData.defaultPickupAddress,
  permissions: app.statuses.permissions
});

const mapDispatchToProps = {
  changeAddress,
  changePosition,
  changeRegionToAnimate,
  checkMultiplePermissions,
  postEvent,
  requestLocation,
  trackUserLocation
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(MapController);

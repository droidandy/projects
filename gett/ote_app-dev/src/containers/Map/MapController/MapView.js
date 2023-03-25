import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Map, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Answers } from 'react-native-fabric';
import { compact, isEqual } from 'lodash';

import { changeAddress } from 'actions/booking';
import { clearCoordinates } from 'actions/ui/map';
import { postEvent } from 'actions/app/gett';

import { withTheme } from 'theme';

import {
  LATTITIDE_DELTA,
  LONGTITUDE_DELTA,
  normalizeCoordinate,
  geocode,
  processLocation,
  isIphoneX,
  isAndroid,
  isIOS,
  prepareCoordinates
} from 'utils';
import { DRAG_DISABLED_STATUSES, ORDER_RECEIVED_STATUS, ACTIVE_DRIVER_STATUSES } from 'utils/orderStatuses';
import { containers } from 'testIDs';
import MapStyle from './MapStyle';
import DarkMapStyle from './DarkMapStyle';

import styles from './styles';

const IDs = containers.Map;

class MapView extends React.Component {
  static propTypes = {
    changeAddress: PropTypes.func,
    children: PropTypes.node,
    clearCoordinates: PropTypes.func,
    coordinatesToResize: PropTypes.array,
    disableDrag: PropTypes.func,
    dragEnable: PropTypes.bool,
    enableDrag: PropTypes.func,
    forceScroll: PropTypes.bool,
    initialRegion: PropTypes.object,
    isOrderCreating: PropTypes.bool,
    onChangePosition: PropTypes.func,
    onEndLoadingPickup: PropTypes.func,
    onStartLoadingPickup: PropTypes.func,
    order: PropTypes.object,
    postEvent: PropTypes.func,
    regionToAnimate: PropTypes.object,
    theme: PropTypes.object
  };

  state = {
    isMapReady: false
  };

  setMapRef = (el) => { this.map = el; };

  componentDidUpdate(prevProps) {
    const {
      regionToAnimate: oldRegion,
      coordinatesToResize: oldCoordinates,
      theme: oldTheme
    } = prevProps;
    const { regionToAnimate, coordinatesToResize, theme } = this.props;

    if (theme.type !== oldTheme.type) {
      setTimeout(() => this.map._updateStyle(), 500); // eslint-disable-line
    }

    if (regionToAnimate && !oldRegion) {
      this.animateToRegion(regionToAnimate);
    } else if (coordinatesToResize && !oldCoordinates) {
      this.resizeMapToCoordinates(coordinatesToResize);
    }
  }

  animateToRegion = (source) => {
    if (source.line && this.props.disableDrag) {
      this.props.disableDrag();
    }
    if (source && (source.latitude || source.lat)) {
      this.map.animateToRegion({
        latitudeDelta: LATTITIDE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA,
        ...prepareCoordinates(source)
      });
    }

    this.props.clearCoordinates();
  };

  getMultiplier = () => (isAndroid ? 2.5 : 1);

  resizeMapToCoordinates = (coordinates, params) => {
    const multiplier = this.getMultiplier();
    this.map.fitToCoordinates(compact(coordinates), {
      edgePadding: { top: 80 * multiplier, bottom: 420 * multiplier, left: 100, right: 100, ...params },
      animated: true
    });

    this.props.clearCoordinates();
  };

  handleSelectPickupAddress = (data) => {
    const { changeAddress, onEndLoadingPickup, order: { pickupAddress }, postEvent } = this.props;

    if (!isEqual(pickupAddress, data)) {
      changeAddress(data, { type: 'pickupAddress' });
      postEvent(
        'main_screen|select_destination|clicked',
        { pickupAddress: data?.line, pickupLat: data?.lat, pickupLng: data?.lng }
      );
    } else if (onEndLoadingPickup) {
      onEndLoadingPickup();
    }
  };

  // eslint-disable-next-line consistent-return
  getGeocode = (region) => {
    const {
      isOrderCreating,
      dragEnable,
      forceScroll,
      order,
      regionToAnimate,
      coordinatesToResize,
      enableDrag,
      onStartLoadingPickup,
      onEndLoadingPickup
    } = this.props;

    if (!dragEnable) { return enableDrag(); }

    const placeId = region.nativeEvent?.placeId;
    const availableCoordsToChange = regionToAnimate || coordinatesToResize;

    if ((forceScroll && dragEnable && !availableCoordsToChange) ||
      (region && isOrderCreating && dragEnable && !order.destinationAddress && !availableCoordsToChange)) {
      const params = placeId
        ? { location_id: placeId, google: true }
        : { lat: normalizeCoordinate(region.latitude), lng: normalizeCoordinate(region.longitude) };

      const nextThenOnResult = !forceScroll
        ? this.handleSelectPickupAddress
        : (data) => {
          if (onEndLoadingPickup) {
            onEndLoadingPickup(data);
          }
          return data;
        };

      if (onStartLoadingPickup && !placeId) {
        onStartLoadingPickup();
      }

      Answers.logCustom('user moves location pin', placeId ? region.nativeEvent?.coordinates : params);
      geocode(params)
        .then(processLocation)
        .then(nextThenOnResult)
        .catch(onEndLoadingPickup);
    }
  };

  isScrollEnabled = order => (
    (order.status === ORDER_RECEIVED_STATUS && !order.asap) ||
    !DRAG_DISABLED_STATUSES.some(status => status === order.status)
  );

  handleUserLocationUpdate = (event) => {
    const { onChangePosition } = this.props;
    if (onChangePosition) {
      onChangePosition(event.nativeEvent.coordinate);
    }
  };

  isActiveDriverStatus = currentStatus => (
    ACTIVE_DRIVER_STATUSES.some(status => status === currentStatus)
  );

  get initialRegion() {
    const { initialRegion } = this.props;

    return initialRegion?.latitude
      ? {
        ...initialRegion,
        latitudeDelta: LATTITIDE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA
      }
      : null;
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  render() {
    const { isOrderCreating, order, theme, forceScroll, children } = this.props;
    const nightMode = theme.isNightMode;

    const iosDelta = isIphoneX() ? 10 : 20;
    const delta = isIOS ? iosDelta : 0;
    const shouldSetPadding = (forceScroll && !isAndroid) || (!order?.destinationAddress && isOrderCreating);

    return (
      <Fragment>
        <StatusBar barStyle={nightMode ? 'light-content' : 'default'} animated />

        <Map
          ref={this.setMapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.initialRegion}
          showsUserLocation={isOrderCreating || this.isActiveDriverStatus(order?.status)}
          onUserLocationChange={this.handleUserLocationUpdate}
          zoomEnabled={forceScroll || this.isScrollEnabled(order)}
          rotateEnabled={false}
          showsCompass={false}
          mapPadding={{ bottom: shouldSetPadding ? 170 + delta : 0 }}
          scrollEnabled={forceScroll || this.isScrollEnabled(order)}
          customMapStyle={nightMode ? DarkMapStyle : MapStyle}
          onRegionChangeComplete={this.getGeocode}
          onPoiClick={this.getGeocode}
          loadingBackgroundColor={theme.color.bgSecondary}
          onLayout={this.onMapLayout}
          testID={IDs.mapView}
        >
          {this.state.isMapReady && children}
        </Map>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ ui }) => ({
  coordinatesToResize: ui.map.coordinates.coordinatesToResize,
  regionToAnimate: ui.map.coordinates.regionToAnimate
});

const mapDispatchToProps = {
  changeAddress,
  clearCoordinates,
  postEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MapView));

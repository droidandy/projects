import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { takeRight, findLastIndex, isEqual, reverse } from 'lodash';
import Map from 'react-native-maps';

import { withTheme } from 'theme';

import { prepareCoordinates, checkCoordinatesDiff, getAngleBetweenCoordinates } from 'utils';

import {
  DriverMarker,
  SourceActiveMarker,
  ETAMarker,
  StopMarker
} from '../Markers';

import Route from './Route';
import { distanceBetweenDots } from './utils';

const destinations = {
  source: SourceActiveMarker,
  eta: ETAMarker,
  etaDestination: ETAMarker
};

const animationDuration = 12000;
const minimalDuration = 4000;

class DriverRoute extends PureComponent {
  static propTypes = {
    areStopsAvailable: PropTypes.bool,
    carType: PropTypes.string,
    destination: PropTypes.object.isRequired,
    destinationType: PropTypes.oneOf(['source', 'eta', 'etaDestination']),
    initialPosition: PropTypes.object,
    routeHidden: PropTypes.bool,
    source: PropTypes.array.isRequired,
    stops: PropTypes.array,
    theme: PropTypes.object
  };

  static defaultProps = {
    areStopsAvailable: false,
    destinationType: 'source',
    routeHidden: false,
    stops: [],
    initialPosition: {}
  };

  constructor(props) {
    super(props);
    this.driverCoordinate = new Map.AnimatedRegion(prepareCoordinates(props.initialPosition));

    this.state = {
      source: [],
      lastCoords: props.initialPosition
    };
  }

  componentDidMount() {
    const { source } = this.props;

    if (source?.length > 1) {
      const lastIndex = this.getLastIndex();
      this.setBearing(source.slice(lastIndex - 2, lastIndex));
    }
  }

  setDriverMarkerRef = (el) => { this.driverMarker = el; };

  setRouteRef = (el) => { this.route = el; };

  componentDidUpdate({ source: oldSource }) {
    if (!isEqual(this.props.source, oldSource)) {
      this.processNewCoords();
    }
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  getLastIndex = (sourceProps = this.props.source) => {
    const { lastCoords } = this.state;

    let lastIndex = findLastIndex(sourceProps, prop => checkCoordinatesDiff(prop, lastCoords));

    if (lastIndex === -1) {
      const distances = sourceProps.map(prop => distanceBetweenDots(prop, lastCoords));

      lastIndex = distances.indexOf(Math.min(...distances));
    }

    return lastIndex;
  }

  processNewCoords = (sourceLocations = null) => {
    const { lastCoords } = this.state;

    const { source } = this.props;
    const sourceProps = prepareCoordinates(sourceLocations) || source;

    if (!sourceLocations && !checkCoordinatesDiff(sourceProps[sourceProps.length - 1], lastCoords, 'unique')) {
      const newSource = sourceProps.slice(this.getLastIndex(sourceProps) + 1);

      if (newSource?.length && !checkCoordinatesDiff(newSource[0], lastCoords) && !this.animationStarted) {
        this.animationStarted = true;

        let time = animationDuration - (300 * (newSource.length - 1));
        time = time < minimalDuration ? minimalDuration : time;

        this.animateDriverToRoute(newSource, time, lastCoords);

        setTimeout(() => this.setState({ lastCoords: newSource[newSource.length - 1] }), time);
      }
    } else if (sourceLocations || (sourceProps[sourceProps.length - 1] && lastCoords.latitude !== 0)) {
      this.stopAnimation();
      this.driverCoordinate.timing({
        ...prepareCoordinates(sourceProps[sourceProps.length - 1]), duration: 200
      }).start();

      this.setState({ lastCoords: sourceProps[sourceProps.length - 1] });
    }
  }

  setBearing = (routeCoordinates) => {
    this.driverMarker.setNativeProps({
      rotation: getAngleBetweenCoordinates({
        lat1: routeCoordinates[0].latitude,
        lat2: routeCoordinates[1].latitude,
        lng1: routeCoordinates[0].longitude,
        lng2: routeCoordinates[1].longitude
      })
    });
  }

  animateSinglePoint = (coords, index, initialPoint, time) => {
    if (index === 0) {
      this.stopAnimation();
    }

    const firstRoutePoint = prepareCoordinates(initialPoint);

    const routeCoordinates = takeRight([firstRoutePoint, ...coords], index + 1).map(prepareCoordinates);

    if (!this.props.routeHidden) {
      setTimeout(() => this.route?.setNativeProps({
        coordinates: reverse([firstRoutePoint, ...coords]).slice(index - 1, coords.length)
      }), time);
    }

    if (routeCoordinates.length > 1) {
      this.setBearing(routeCoordinates);
    }
  }

  stopAnimation = () => {
    clearInterval(this.pathAnimationInterval);
    this.animationStarted = false;
  };

  animateDriverToRoute = (coords, duration, initialPoint) => {
    clearInterval(this.pathAnimationInterval);
    const animations = coords.map(c => (
      this.driverCoordinate.timing({ ...prepareCoordinates(c), duration: duration / coords.length })
    ));
    Animated.sequence(animations).start();

    let index = coords.length;

    this.animateSinglePoint(coords, index, initialPoint);
    index -= 1;

    this.pathAnimationInterval = setInterval(() => {
      this.animateSinglePoint(coords, index, initialPoint, duration / coords.length);
      index -= 1;
    }, duration / coords.length);
  };

  renderDriverMarker = () => {
    const { theme, carType } = this.props;

    return (
      <DriverMarker
        innerRef={this.setDriverMarkerRef}
        coordinate={this.driverCoordinate}
        nightMode={theme.isNightMode}
        anchorX={0.5}
        anchorY={0.7838}
        type={carType}
      />
    );
  };

  render() {
    const { destination, source, routeHidden, destinationType, stops, areStopsAvailable } = this.props;

    const type = destinationType === 'eta' && !destination.value ? 'source' : destinationType;

    const Destination = destinations[type];
    const markerType = destinationType === 'etaDestination' ? 'destination' : 'source';

    return (
      <Fragment>
        {this.renderDriverMarker()}
        <Destination coordinate={destination} value={destination.value} type={markerType} />
        {areStopsAvailable && stops.map(stop => <StopMarker coordinate={stop} key={stop} />)}
        {!routeHidden && <Route polyRef={this.setRouteRef} path={[]} />}
        {!routeHidden && <Route path={source.slice(0, this.getLastIndex(source) + 2)} />}
      </Fragment>
    );
  }
}

export default withTheme(DriverRoute);

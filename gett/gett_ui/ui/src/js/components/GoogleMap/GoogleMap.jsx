/* global google */
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import { Tooltip } from 'antd';
import { isEmpty, isEqual } from 'lodash';
import { toLatLng, ZoomControl, defaultLondonCenter } from './utils';
import CN from 'classnames';

import css from './GoogleMap.css';

export default class GoogleMap extends Component {
  static propTypes = {
    center: PropTypes.object,
    fitBounds: PropTypes.bool,
    zoom: PropTypes.number,
    zoomControl: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    directionsServiceParams: PropTypes.shape({
      apply: PropTypes.bool,
      origin: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number
      }),
      destination: PropTypes.string,
      waypoints: PropTypes.arrayOf(PropTypes.string)
    }),
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    followPoint: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.array])
  };

  static defaultProps = {
    zoom: 15,
    width: 400,
    height: 400,
    zoomControl: true
  };

  state = {
    initialized: false,
    followMode: false
  };

  componentDidMount() {
    const { center, zoom, zoomControl, fitBounds } = this.props;

    this.map = new google.maps.Map(this.domNode, {
      center: toLatLng(center || defaultLondonCenter),
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      zoomControl: false,
      zoom
    });

    if (zoomControl) {
      const zoomControlDiv = document.createElement('div');
      new ZoomControl(zoomControlDiv, this.map);
      zoomControlDiv.index = 1;
      this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(zoomControlDiv);
    }

    // NOTE: since directionsService application only happens on mounting stage,
    // it won't be applied if mounted component receives new props, according
    // to which directionsService should be applied
    if (this.shouldApplyDirectionsService()) this.applyDirectionsService();

    this.setState({ initialized: true });
    if (fitBounds) this.fitToMarkerBounds();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // to prevent extra re-rendering when 'Follow updates' mode is on (bookings table)
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  componentDidUpdate(prevProps) {
    const { center, followPoint, fitBounds } = this.props;

    if (fitBounds && !followPoint) this.fitToMarkerBounds();

    if (!prevProps.center && center) {
      return this.map.setCenter(toLatLng(center));
    }
    if (followPoint && this.state.followMode) {
      return this.map.setOptions({
        center: toLatLng(followPoint),
        fullscreenControl: false,
        scrollwheel: false,
        navigationControl: false,
        scaleControl: false,
        zoomControl: false,
        draggable: false,
        disableDoubleClickZoom: true,
      });
    } else {
      this.map.setOptions({
        scrollwheel: true,
        fullscreenControl: false,
        navigationControl: true,
        scaleControl: true,
        zoomControl: false,
        draggable: true,
        disableDoubleClickZoom: false
      });
    }
  }

  setDomNodeRef = div => this.domNode = div;

  shouldApplyDirectionsService() {
    const { directionsServiceParams: params } = this.props;

    return params && params.apply;
  }

  applyDirectionsService() {
    const { origin: { lat, lng }, destination, waypoints } = this.props.directionsServiceParams;

    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    const directionRequest = {
      provideRouteAlternatives: false,
      travelMode: 'DRIVING',
      waypoints: waypoints.map(w => ({ location: w })),
      origin: `${lat}, ${lng}`,
      destination
    };

    directionsDisplay.setMap(this.map);
    directionsDisplay.set('directions', null);
    directionsService.route(directionRequest, function(result, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(result);
      }
    });
  }

  limitMaxZoom() {
    if (this.map.getZoom() > 18) this.map.setZoom(18);
  }

  toggleFollowMode = () => {
    const { fitBounds } = this.props;
    const currentState = this.state.followMode;
    if (!currentState) this.map.setZoom(16);
    this.setState({ followMode: !currentState }, () => {
      if (!this.state.followMode && fitBounds) {
        this.fitToMarkerBounds();
      }
    });
  };

  fitToMarkerBounds() {
    const { children } = this.props;
    const markers = Children.toArray(children).filter(child => child.type.displayName === 'Marker');

    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(toLatLng(marker.props.position));
      });

      this.map.setCenter(bounds.getCenter());
      this.map.fitBounds(bounds);

      this.limitMaxZoom();
      // need this for double checking of the max zoom and smooth behaviour
      const listener = google.maps.event.addListener(this.map, 'idle', () => {
        this.limitMaxZoom();
        google.maps.event.removeListener(listener);
      });
    }
  }

  render() {
    const { width, height, className, wrapperClassName, children, style, followPoint } = this.props;
    const { initialized, followMode } = this.state;
    return (
      <div className={ CN(wrapperClassName, 'relative') }>
        <div ref={ this.setDomNodeRef } className={ CN(css.frame, className) } style={ { width, height, ...style } }>
          { initialized && Children.toArray(children).map(child =>
            React.cloneElement(child, { map: this.map })
          ) }
        </div>
        { !isEmpty(followPoint) &&
          <Tooltip title="Follow Driver" placement="left">
            <div className={ `${css.followBtn} white-bg br-2 pointer` } onClick={ this.toggleFollowMode }>
              <Icon icon="MdFilterCenterFocus" className={ CN('text-24', { 'blue-text': followMode }) } />
            </div>
          </Tooltip>
        }
      </div>
    );
  }
}

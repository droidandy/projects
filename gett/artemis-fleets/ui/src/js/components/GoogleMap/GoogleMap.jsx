/* global google */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { toLatLng } from './utils';
import Marker from './Marker';
import Path from './Path';
import isEqual from 'lodash/isEqual';
import flatMap from 'lodash/flatMap';
import compact from 'lodash/compact';

import css from './GoogleMap.css';

// corresponds to approximate center of London
const defaultCenter = { lat: 54.781356, lng: -3.9171406 };

export default class GoogleMap extends PureComponent {
  static propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    markers: PropTypes.arrayOf(PropTypes.object),
    paths: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    zoom: 6,
    width: 400,
    height: 400,
    markers: [],
    paths: []
  };

  state = { initialized: false };

  componentDidMount() {
    this.map = new google.maps.Map(this.domNode, {
      streetViewControl: false,
      zoomControl: true,
      maxZoom: 17,
      minZoom: 5
    });

    this.infoWindow = new google.maps.InfoWindow({
      maxWidth: 350
    });

    this.fitToCenter(this.props);
    this.setState({ initialized: true });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.center, this.props.center)) {
      this.fitToCenter(nextProps, { center: nextProps.center });
    }
  }

  componentDidUpdate(prevProps) {
    if(!isEqual(prevProps.paths, this.props.paths)) {
      this.autoCenter();
    }
  }

  getLatLng(coord) {
    return { lat: coord.lat || coord.latitude, lng: coord.lng || coord.longitude };
  }

  getAllCoordinates(props) {
    const { markers, paths } = props;

    const pathsPoints = paths.map((p) => {
      let points = [];
      if(p.start) {
        points.push(p.start);
      }
      if(p.finish) {
        points.push(p.finish);
      }
      if(p.points) {
        points = points.concat(p.points);
      }
      return points.map(this.getLatLng);
    });
    return [...markers.map(this.getLatLng), ...flatMap(pathsPoints)];
  }

  fitToCenter(props, { auto, center } = {}) {
    if (center) {
      this.setCenter(center);
    } else if (auto) {
      const bounds = new google.maps.LatLngBounds();
      this.getAllCoordinates(props).forEach(m => bounds.extend(toLatLng(this.getLatLng(m))));
      this.map.fitBounds(bounds);
    } else {
      this.setCenter(defaultCenter);
    }
  }

  setCenter(center) {
    this.map.setCenter(toLatLng(center));
    this.map.setZoom(this.props.zoom);
  }

  autoCenter() {
    this.fitToCenter(this.props, { auto: true });
  }

  handleMarkerClick = (marker, content) => {
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  };

  getContentHtml(marker) {
    return `
        <div><span class="bold-text">Driver: </span>${marker.driverName}</div>
        <div><span class="bold-text">Driver Id: </span>${marker.driverId}</div>
        <div><span class="bold-text">Car Model: </span>${marker.carModel}</div>
        <div><span class="bold-text">License Number: </span>${marker.licenseNumber}</div>
        <div><span class="bold-text">Phone: </span>${marker.driverPhone}</div>
      `;
  }

  render() {
    const { width, height, className, children, style, markers, paths } = this.props;
    const { initialized } = this.state;

    return (
      <div ref={ div => this.domNode = div } className={ CN(css.frame, className) } style={ { width, height, ...style } }>
        { initialized && markers.length > 0 &&
          markers.map(m => (
            <Marker
              key={ m.driverId }
              map={ this.map }
              type={ m.statusId }
              position={ this.getLatLng(m) }
              content={ this.getContentHtml(m) }
              onClick={ this.handleMarkerClick }
            />
          ))
        }
        { initialized && paths.length > 0 &&
          paths.map((p, i) => {
            const path = p.points ? p.points : compact([p.start, p.finish]);
            return (
              <div key={ i }>
                { path.length > 1 &&
                  <Path map={ this.map } path={ path } />
                }
                { p.start &&
                  <Marker
                    map={ this.map }
                    type="start"
                    position={ this.getLatLng(p.start) }
                  />
                }
                { p.finish &&
                  <Marker
                    map={ this.map }
                    type="finish"
                    position={ this.getLatLng(p.finish) }
                  />
                }
              </div>
            );
          })
        }
        { initialized && React.Children.toArray(children).map(child =>
          React.cloneElement(child, { map: this.map })
        ) }
      </div>
    );
  }
}

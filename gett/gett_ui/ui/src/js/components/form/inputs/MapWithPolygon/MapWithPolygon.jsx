/* global google */
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { map, isEmpty } from 'lodash';
import { toLatLng, defaultLondonCenter } from 'components/GoogleMap/utils';
import { DeleteVertexMenu } from 'components/GoogleMap';
import CN from 'classnames';

import css from './styles.css';

export default class MapWithPolygon extends Component {
  static propTypes = {
    center: PropTypes.object,
    fitBounds: PropTypes.bool,
    zoom: PropTypes.number,
    zoomControl: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    wrapperClassName: PropTypes.string,
    children: PropTypes.node,
    style: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])),
    error: PropTypes.string,
  };

  static defaultProps = {
    zoom: 15,
    width: 400,
    height: 400,
    zoomControl: true
  };

  state = {
    initialized: false,
    polygonDragged: false,
    loading: true
  };

  componentDidMount() {
    const { center, zoom, zoomControl, fitBounds, value } = this.props;

    this.map = new google.maps.Map(this.domNode, {
      center: toLatLng(center || defaultLondonCenter),
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
      zoomControl,
      zoom
    });

    // add map loading check for the feature.specs
    google.maps.event.addListener(this.map, 'tilesloaded', () => {
      this.setState({ loading: false });
    });

    this.deleteVertexMenu = new DeleteVertexMenu();

    if (value) {
      this.applyPolygon();
    } else {
      this.applyDrawingManager();
    }

    this.setState({ initialized: true });
    if (fitBounds) this.fitToMarkerBounds();
  }

  componentDidUpdate() {
    const { fitBounds, value } = this.props;

    if (fitBounds && !this.state.polygonDragged) this.fitToMarkerBounds();

    if (isEmpty(value) && this.poly) {
      this.poly.setMap(null);
      this.poly = null;

      // to show drawing tools again if we deleted the poly
      this.applyDrawingManager();
    }
  }

  componentWillUnmount() {
    this.deleteVertexMenu = null;
    if (this.path) {
      google.maps.event.clearInstanceListeners(this.path);
      this.path = null;
      this.poly = null;
    }
  }

  setDomNodeRef = div => this.domNode = div;

  onChange(poly) {
    const { onChange } = this.props;

    const vertices = poly.getPath().getArray();
    const coordinates = map(vertices, v => ({ lat: v.lat(), lng: v.lng() }));

    onChange(coordinates);
  }

  onDragStart = () => {
    this.setState({ polygonDragged: true });
  };

  onDragEnd = () => {
    this.setState({ polygonDragged: false });
  };

  addListeners(poly) {
    this.path = poly.getPath();
    google.maps.event.addListener(poly, 'click', (e) => {
      // Check if click was on a vertex control point
      if (e.vertex === undefined) {
        return;
      }
      this.deleteVertexMenu.open(this.map, this.path, e.vertex);
    });

    google.maps.event.addListener(this.path, 'insert_at', () => this.onChange(poly));
    google.maps.event.addListener(this.path, 'remove_at', () => this.onChange(poly));
    google.maps.event.addListener(this.path, 'set_at', () => this.onChange(poly));

    google.maps.event.addListener(poly, 'dragstart', this.onDragStart);
    google.maps.event.addListener(poly, 'dragend', this.onDragEnd);
  }

  onPolygonComplete(poly, manager) {
    // is used to limit the poly to one by the map
    manager.setMap(null);

    this.poly = poly;
    this.onChange(poly);
    this.addListeners(poly);
  }

  applyDrawingManager() {
    if (!this.drawingManager) {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['polygon']
        },
        polygonOptions: {
          editable: true,
          draggable: true
        }
      });

      google.maps.event.addListener(this.drawingManager, 'polygoncomplete', poly => this.onPolygonComplete(poly, this.drawingManager));
    }

    this.drawingManager.setMap(this.map);
  }

  applyPolygon() {
    this.poly = new google.maps.Polygon({
      path: this.props.value,
      editable: true,
      draggable: true,
      map: this.map
    });

    this.addListeners(this.poly);
  }

  limitMaxZoom() {
    if (this.map.getZoom() > 18) this.map.setZoom(18);
  }

  fitToMarkerBounds() {
    const { children, value } = this.props;
    const shapes = Children.toArray(children);

    if (shapes.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      shapes.forEach((shape) => {
        bounds.extend(toLatLng(shape.props.position));
      });

      if (value) {
        value.forEach((val) => {
          bounds.extend(toLatLng(val));
        });
      }

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
    const { width, height, className, wrapperClassName, children, style, error } = this.props;
    const { initialized, loading } = this.state;
    return (
      <div className={ CN(wrapperClassName, 'relative', { 'mapLoaded': !loading }) }>
        <div ref={ this.setDomNodeRef } className={ CN(css.frame, className) } style={ { width, height, ...style } }>
          { initialized && Children.toArray(children).map(child =>
            React.cloneElement(child, { map: this.map })
          ) }
        </div>
        { error && <div className="error">{ error }</div> }
      </div>
    );
  }
}

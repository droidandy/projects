/* global google */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toLatLng } from './utils';

export default class Polyline extends PureComponent {
  static propTypes = {
    map: PropTypes.object,
    path: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])),
    geodesic: PropTypes.bool,
    strokeColor: PropTypes.string,
    strokeOpacity: PropTypes.number,
    strokeWeight: PropTypes.number
  };

  static defaultProps = {
    geodesic: true,
    strokeColor: '#2a99f5',
    strokeOpacity: 0.8,
    strokeWeight: 4
  };

  componentDidMount() {
    const { map, path, geodesic, strokeColor, strokeOpacity, strokeWeight } = this.props;

    this.line = new google.maps.Polyline({
      map,
      path: path.map(toLatLng),
      geodesic,
      strokeColor,
      strokeOpacity,
      strokeWeight
    });
  }

  componentDidUpdate() {
    this.line.setPath(this.props.path.map(toLatLng));
  }

  componentWillUnmount() {
    this.line.setMap(null);
  }

  render() {
    return null;
  }
}

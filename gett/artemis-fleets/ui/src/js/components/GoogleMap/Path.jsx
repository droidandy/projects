/* global google */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toLatLng } from './utils';
import isEqual from 'lodash/isEqual';

export default class Path extends PureComponent {
  static propTypes = {
    map: PropTypes.object,
    path: PropTypes.arrayOf(PropTypes.object)
  };

  componentDidMount() {
    const { map, path } = this.props;
    this.addPath(map, path);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.path, this.props.path)) {
      this.removePath();
      this.addPath(nextProps.map, nextProps.path);
    }
  }

  componentWillUnmount() {
    this.removePath();
  }

  addPath(map, path) {
    const dots = path.map(toLatLng);

    this.path = new google.maps.Polyline({
      path: dots,
      geodesic: true,
      strokeColor: '#2a99f5',
      strokeOpacity: 0.8,
      strokeWeight: 4
    });

    this.path.setMap(map);
  }

  removePath() {
    this.path.setMap(null);
  }

  render() {
    return null;
  }
}

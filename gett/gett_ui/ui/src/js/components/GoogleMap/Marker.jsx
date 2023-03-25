/* global google */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toLatLng, getIcon } from './utils';

export default class Marker extends PureComponent {
  // used in GoogleMap component when determine Marker components when fitting
  // to bounds. `type.name` property gets uglified to one-char string during
  // webpack build for production envs.
  static displayName = 'Marker';

  static propTypes = {
    map: PropTypes.object,
    position: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    title: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    stopPointNumber: PropTypes.number
  };

  static defaultProps = {
    color: '#ffaf31'
  };

  componentDidMount() {
    const { map, position, title, label, icon, color, stopPointNumber } = this.props;

    this.marker = new google.maps.Marker({
      map,
      position: toLatLng(position),
      title,
      label,
      icon: icon && getIcon(icon, color, stopPointNumber),
      optimized: false
    });
  }

  componentDidUpdate() {
    this.marker.setPosition(toLatLng(this.props.position));
  }

  componentWillUnmount() {
    this.marker.setMap(null);
  }

  render() {
    return null;
  }
}

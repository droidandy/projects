import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';
import { FastComponent } from 'utils';

import Marker from './Basic';

const carTypes = {
  BlackTaxi: 'blackTaxi',
  BlackTaxiXL: 'blackTaxiXL'
};

export default class DriverMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired,
    innerRef: PropTypes.func,
    nightMode: PropTypes.bool,
    type: PropTypes.string
  };

  render() {
    const { coordinate, nightMode, type, innerRef, ...rest } = this.props;

    return (
      <Marker coordinate={coordinate} id="driverMarker" animated innerRef={innerRef} {...rest}>
        <Icon name={`${carTypes[type] || 'car'}${nightMode ? 'NightMode' : ''}`} width={36} height={80} />
      </Marker>
    );
  }
}

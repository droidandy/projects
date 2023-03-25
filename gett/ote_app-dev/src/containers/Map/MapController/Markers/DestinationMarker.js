import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';
import { FastComponent } from 'utils';

import { color } from 'theme';

import Marker from './Basic';

export default class DestinationMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired
  };

  render() {
    const { coordinate } = this.props;

    return (
      <Marker coordinate={coordinate} id="destinationMarker">
        <Icon name="point" color={color.danger} width={16} height={19} />
      </Marker>
    );
  }
}

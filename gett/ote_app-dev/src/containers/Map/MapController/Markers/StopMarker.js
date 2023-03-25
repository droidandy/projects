import React from 'react';
import PropTypes from 'prop-types';
import { color } from 'theme';
import { FastComponent } from 'utils';

import { Icon } from 'components';

import Marker from './Basic';

export default class StopMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired
  };

  render() {
    const { coordinate } = this.props;

    return (
      <Marker coordinate={coordinate} id="stopMarker">
        <Icon name="point" color={color.secondaryText} size={12} />
      </Marker>
    );
  }
}

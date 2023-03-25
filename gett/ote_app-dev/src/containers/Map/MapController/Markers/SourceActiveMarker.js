import React from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import { Icon } from 'components';
import { color } from 'theme';
import Marker from './Basic';

export default class SourceActiveMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired
  };

  render() {
    const { coordinate } = this.props;

    return (
      <Marker coordinate={coordinate} id="point">
        <Icon name="point" color={color.success} size={16} />
      </Marker>
    );
  }
}

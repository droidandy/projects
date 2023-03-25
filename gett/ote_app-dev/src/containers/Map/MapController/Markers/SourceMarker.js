import React from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import { Icon } from 'components';

import Marker from './Basic';

export default class SourceMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired
  };

  render() {
    const { coordinate } = this.props;

    return (
      <Marker coordinate={coordinate} id="sourceMarker">
        <Icon name="pinLocationSet" width={32} height={52} />
      </Marker>
    );
  }
}

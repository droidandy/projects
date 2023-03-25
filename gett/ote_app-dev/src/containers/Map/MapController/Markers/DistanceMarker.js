import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import InfoMarker from './InfoMarker';
import DestinationMarker from './DestinationMarker';

export default class DistanceMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired,
    value: PropTypes.string
  };

  render() {
    const { coordinate, value } = this.props;

    return (
      <Fragment>
        <InfoMarker
          coordinate={coordinate}
          title="Distance"
          icon="distance"
          value={value}
        />
        <DestinationMarker coordinate={coordinate} />
      </Fragment>
    );
  }
}

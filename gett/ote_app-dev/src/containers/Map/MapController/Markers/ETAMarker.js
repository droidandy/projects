import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import InfoMarker from './InfoMarker';
import SourceActiveMarker from './SourceActiveMarker';
import DestinationMarker from './DestinationMarker';

const markers = {
  source: SourceActiveMarker,
  destination: DestinationMarker
};

export default class ETAMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['source', 'destination']),
    value: PropTypes.string
  };

  static defaultProps = {
    type: 'source'
  }

  render() {
    const { coordinate, value, type } = this.props;
    const Marker = markers[type];

    return (
      <Fragment>
        <InfoMarker
          coordinate={coordinate}
          title="ETA"
          icon="timer"
          value={value}
        />
        <Marker coordinate={coordinate} />
      </Fragment>
    );
  }
}

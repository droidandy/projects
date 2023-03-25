import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import InfoMarker from './InfoMarker';
import SourceActiveMarker from './SourceActiveMarker';

export default class JourneyTimeMarker extends FastComponent {
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
          title="Journey Time"
          icon="timer"
          value={value}
        />
        <SourceActiveMarker coordinate={coordinate} />
      </Fragment>
    );
  }
}

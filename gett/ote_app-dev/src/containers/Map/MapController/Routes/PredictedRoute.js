import React from 'react';
import PropTypes from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';
import Config from 'react-native-config';

import { prepareCoordinates, FastComponent } from 'utils';
import { withTheme } from 'theme';

class PredictedRoute extends FastComponent {
  static propTypes = {
    destination: PropTypes.object.isRequired,
    source: PropTypes.object.isRequired,
    stops: PropTypes.arrayOf(PropTypes.object),
    theme: PropTypes.object
  };

  static defaultProps = {
    stops: []
  };

  render() {
    const { source, destination, stops, theme } = this.props;

    return (
      <MapViewDirections
        origin={prepareCoordinates(source)}
        destination={prepareCoordinates(destination)}
        waypoints={stops.map(prepareCoordinates)}
        apikey={Config.GOOGLE_API_KEY}
        strokeWidth={3}
        resetOnChange={false}
        strokeColor={theme.color.route}
      />
    );
  }
}

export default withTheme(PredictedRoute);

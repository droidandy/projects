import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FastComponent } from 'utils';

import {
  SourceActiveMarker,
  ETAMarker,
  JourneyTimeMarker,
  DistanceMarker,
  DestinationMarker,
  StopMarker
} from '../Markers';

import PredictedRoute from './PredictedRoute';
import Route from './Route';

const Sources = {
  default: SourceActiveMarker,
  eta: ETAMarker,
  journey: JourneyTimeMarker
};

const Destinations = {
  default: DestinationMarker,
  distance: DistanceMarker
};

export default class OrderRoute extends FastComponent {
  static propTypes = {
    destination: PropTypes.object.isRequired,
    destinationType: PropTypes.oneOf(['default', 'distance']),
    path: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    source: PropTypes.object.isRequired,
    sourceType: PropTypes.oneOf(['default', 'eta', 'journey']),
    stops: PropTypes.array
  };

  static defaultProps = {
    destinationType: 'default',
    sourceType: 'default',
    stops: []
  };

  render() {
    const { source, sourceType, destination, destinationType, stops, path } = this.props;

    const Source = Sources[sourceType];
    const Destination = Destinations[destinationType];

    const processedStops = stops.map(s => s.address || s);

    return (
      <Fragment>
        <Source coordinate={source} value={source.value} />
        <Destination coordinate={destination} value={destination.value} />
        {processedStops.map((stop, i) => <StopMarker coordinate={stop} key={stop.line + i} />)}
        {path && path.length > 2
          ? <Route key="Route" path={path} />
          : <PredictedRoute key="PredictedRoute" source={source} destination={destination} stops={processedStops} />
        }
      </Fragment>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import Map from 'react-native-maps';

import { prepareCoordinates } from 'utils';

export default class MarkerBasic extends React.Component {
  static propTypes = {
    anchorX: PropTypes.number,
    anchorY: PropTypes.number,
    animated: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    coordinate: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    innerRef: PropTypes.func
  };

  static defaultProps = {
    anchorX: 0.5,
    anchorY: 0.5
  };

  render() {
    const { coordinate, children, id, anchorX, anchorY, animated, innerRef, ...rest } = this.props;
    const Marker = animated ? Map.Marker.Animated : Map.Marker;

    return (
      <Marker
        key={id}
        ref={innerRef}
        coordinate={prepareCoordinates(coordinate)}
        anchor={{ x: anchorX, y: anchorY }}
        stopPropagation
        tracksViewChanges={false}
        {...rest}
      >
        {children}
      </Marker>
    );
  }
}

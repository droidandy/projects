import React from 'react';
import PropTypes from 'prop-types';
import { View as AnimatableView } from 'react-native-animatable';
import { deviceHeight } from 'utils';

const DURATION = 800;
const DELAY = 1000;

export default class TransitionView extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    scale: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.bool]),
    value: PropTypes.number
  };

  render() {
    const { style, scale, value, children } = this.props;

    return (
      <AnimatableView
        pointerEvents="box-none"
        animation={{
          from: { translateY: value || deviceHeight, scale: 1 },
          to: { translateY: 0, scale: scale ? 0.833 : 1 }
        }}
        duration={DURATION}
        delay={DELAY}
        easing="linear"
        useNativeDriver
        style={[style, { width: '100%' }]}
      >
        {children}
      </AnimatableView>
    );
  }
}

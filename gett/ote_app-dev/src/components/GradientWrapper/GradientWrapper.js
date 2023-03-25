import React from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import { color } from 'theme';

const GradientWrapper = ({ children, ...rest }) => (
  <LinearGradient {...rest}>
    {children}
  </LinearGradient>
);

GradientWrapper.propTypes = {
  children: PropTypes.node,
  colors: PropTypes.array,
  end: PropTypes.object,
  start: PropTypes.object,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

GradientWrapper.defaultProps = {
  colors: [color.primaryText, color.primaryText],
  end: { x: 1, y: 1 },
  start: { x: 0, y: 1 }
};

export default GradientWrapper;

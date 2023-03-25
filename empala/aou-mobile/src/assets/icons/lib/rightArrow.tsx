import React from 'react';
import Svg, { Path } from 'react-native-svg';

const rightArrow = ({ color = '#C1CACF', ...rest }) => (
  <Svg viewBox="0 0 11 20" fill="none" {...rest}>
    <Path
      d="M1.3335 1.75L9.5835 10L1.3335 18.25"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default rightArrow;

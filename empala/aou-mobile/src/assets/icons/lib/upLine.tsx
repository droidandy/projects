import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function UpLine({ color = '#00C0A9', ...rest }) {
  return (
    <Svg viewBox="0 0 12 8" {...rest}>
      <Path d="M10.5 1.5L6.6 5.4L4.4 3.2L1 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

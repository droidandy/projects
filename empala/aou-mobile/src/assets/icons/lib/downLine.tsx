import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function DownLine({ color = '#EA2B27', ...rest }) {
  return (
    <Svg viewBox="0 0 12 7" {...rest}>
      <Path d="M1 1L4.9 4.9L7.1 2.7L10.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

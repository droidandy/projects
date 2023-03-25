import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Close({ color = '#ccc', ...rest }) {
  return (
    <Svg viewBox="0 0 34 34" {...rest}>
      <Path d="M25.5 8.5L8.5 25.5" stroke={color} strokeWidth="2.83333" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8.5 8.5L25.5 25.5" stroke={color} strokeWidth="2.83333" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

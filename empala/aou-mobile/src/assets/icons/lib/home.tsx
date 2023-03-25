import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Home({ color = '#004596', secondColor = '#00C0A9', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <Path d="M4 12L6 10.1914V19V21H4V12Z" fill={color} />
      <Path d="M20 21H18V19V13V10.1914L20 12V21Z" fill={color} />
      <Path d="M11 15V21H9V13H15V21H13V15H11Z" fill={secondColor} />
      <Path d="M1 12L12 2.09961L23 12H20L12 4.79102L4 12H1Z" fill={color} />
    </Svg>
  );
}

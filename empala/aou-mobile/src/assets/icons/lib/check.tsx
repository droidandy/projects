import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function Check({ color = '#fff', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <G opacity="0.8">
        <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

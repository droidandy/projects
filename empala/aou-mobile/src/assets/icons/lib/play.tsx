import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Play({ color = '#fff', ...rest }) {
  return (
    <Svg viewBox="0 0 27 32" {...rest}>
      <Path
        d="M2 6.327C2 3.162 5.501 1.25 8.163 2.962l15.047 9.673c2.45 1.575 2.45 5.155 0 6.73L8.163 29.038C5.501 30.75 2 28.838 2 25.673V6.327z"
        stroke={color}
        strokeWidth="3.778"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

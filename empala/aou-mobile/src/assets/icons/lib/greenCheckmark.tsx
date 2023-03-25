import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const GreenCheckmark = (props) => (
  <Svg viewBox="0 0 108 108" fill="none" {...props}>
    <Circle cx={54} cy={54} r={54} fill="#00C0A9" />
    <Path
      d="M75.3332 41L45.9998 70.3333L32.6665 57"
      stroke="white"
      strokeWidth={5.33333}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default GreenCheckmark;

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function backArrow({ color = 'white', ...rest }): JSX.Element {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" {...rest}>
      <Path
        d="M19.9999 11.4531H4.90601"
        stroke={color}
        strokeWidth="2.15628"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.453 19L4.90601 11.453L12.453 3.90607"
        stroke={color}
        strokeWidth="2.15628"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Feed({ color = '#004596', secondColor = '#00C0A9', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <Path
        d="M2 3V18C2 19.645 3.35503 21 5 21H19C20.645 21 22 19.645 22 18V7H20V18C20 18.565 19.565 19 19 19C18.435 19 18 18.565 18 18V3H2ZM4 5H16V18C16 18.3883 16.279 18.658 16.416 19H5C4.43497 19 4 18.565 4 18V5Z"
        fill={color}
      />
      <Path d="M6 10V7H14V10H6Z" fill={secondColor} />
      <Path d="M6 14V12H14V14H6Z" fill={secondColor} />
      <Path d="M6 18V16H14V18H6Z" fill={secondColor} />
    </Svg>
  );
}

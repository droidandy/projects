import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Add({ color = '#004596', secondColor = '#00C0A9', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <Path
        d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM12 4C16.411 4 20 7.589 20 12C20 16.411 16.411 20 12 20C7.589 20 4 16.411 4 12C4 7.589 7.589 4 12 4Z"
        fill={color}
      />
      <Path d="M11 11V8H13V11H16V13H13V16H11V13H8V11H11Z" fill={secondColor} />
    </Svg>
  );
}

import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Explore({ color = '#004596', secondColor = '#00C0A9', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <Path
        d="M5 3C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H11.6836C11.3876 20.378 11.1811 19.707 11.0801 19H5V9H19V11.0781C19.707 11.1791 20.378 11.3856 21 11.6816V5C21 3.895 20.105 3 19 3H5ZM5 5H19V7H5V5ZM7 11V13H9V11H7ZM7 15V17H9V15H7Z"
        fill={color}
      />
      <Path d="M11 13V11H17V11.0801C15.494 11.2961 14.1425 11.985 13.1055 13H11Z" fill={color} />
      <Path
        d="M18 13C15.2 13 13 15.2 13 18C13 20.8 15.2 23 18 23C19 23 20.0008 22.6992 20.8008 22.1992L22.5996 24L24 22.5996L22.1992 20.8008C22.6992 20.0008 23 19 23 18C23 15.2 20.8 13 18 13ZM18 15C19.7 15 21 16.3 21 18C21 19.7 19.7 21 18 21C16.3 21 15 19.7 15 18C15 16.3 16.3 15 18 15Z"
        fill={secondColor}
      />
    </Svg>
  );
}

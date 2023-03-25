import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function Error({ color = '#EA2B27', ...rest }) {
  return (
    <Svg viewBox="0 0 28 28" {...rest}>
      <Circle cx="14" cy="14" r="14" fill={color} />
      <Path d="M15.4222 7.90909H12.5778L12.8335 17.0753H15.1729L15.4222 7.90909ZM14.0032 21.1662C14.8214 21.1662 15.5309 20.4822 15.5373 19.6321C15.5309 18.7947 14.8214 18.1108 14.0032 18.1108C13.1594 18.1108 12.4627 18.7947 12.4691 19.6321C12.4627 20.4822 13.1594 21.1662 14.0032 21.1662Z" fill="white" />
    </Svg>
  );
}

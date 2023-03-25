import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Minus({ color = '#8B9195', ...rest }) {
  return (
    <Svg viewBox="0 0 12 3" {...rest}>
      <Path d="M10.9091 2.43122L7.09064 2.43176H4.90855L1.09091 2.43122L0.985847 2.42622C0.432646 2.37336 0 1.90736 0 1.34031C0 0.737816 0.488417 0.249399 1.09091 0.249399L4.90855 0.249672H7.09064L10.9091 0.249399L11.0142 0.254393C11.5674 0.307254 12 0.773257 12 1.34031C12 1.9428 11.5116 2.43122 10.9091 2.43122Z" fill={color} />
    </Svg>
  );
}

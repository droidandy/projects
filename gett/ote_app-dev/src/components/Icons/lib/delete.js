import React from 'react';
import * as SVG from 'react-native-svg';

export default function Delete({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 12 12" {...rest}>
      <SVG.Path fill={color || '#BBBBBF'} fillRule="nonzero" d="M6.96 6.025l3.89 3.889a.75.75 0 1 1-1.061 1.06l-3.89-3.889-3.889 3.89A.75.75 0 0 1 .95 9.913l3.889-3.89-3.89-3.888A.75.75 0 0 1 2.01 1.075L5.9 4.964l3.889-3.89a.75.75 0 1 1 1.06 1.062L6.96 6.025z" />
    </SVG.Svg>
  );
}

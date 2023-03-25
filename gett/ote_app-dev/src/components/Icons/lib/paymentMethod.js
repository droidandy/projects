import React from 'react';
import * as SVG from 'react-native-svg';

export default function PaymentMethod({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 16" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M2 1.5a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h20a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5H2zM2 0h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM0 3h24v1.5H0V3zm0 3h24v1.5H0V6zm3 5h3v1.5H3V11zm4 0h3v1.5H7V11z" />
    </SVG.Svg>
  );
}

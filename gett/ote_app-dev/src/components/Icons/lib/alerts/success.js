import React from 'react';
import * as SVG from 'react-native-svg';

export default function Success({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 28 28" {...rest}>
      <SVG.Path fill={color || '#FFF'} fillRule="nonzero" d="M14 28C6.27 28 0 21.73 0 14S6.27 0 14 0s14 6.27 14 14-6.27 14-14 14zm0-25.53C7.628 2.47 2.47 7.629 2.47 14c0 6.372 5.158 11.53 11.53 11.53 6.372 0 11.53-5.158 11.53-11.53 0-6.372-5.158-11.53-11.53-11.53zm3.861 7.092a1.4 1.4 0 0 1 2.08 1.874l-6.3 7c-.256.285-.619.453-1.023.464-.39 0-.747-.148-1.008-.41l-3.5-3.5a1.4 1.4 0 1 1 1.98-1.98l2.457 2.457 5.314-5.905z" />
    </SVG.Svg>
  );
}

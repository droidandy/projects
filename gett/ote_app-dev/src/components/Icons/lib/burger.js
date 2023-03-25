import React from 'react';
import * as SVG from 'react-native-svg';

export default function Burger({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 19" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M1.5 0h21a1.5 1.5 0 0 1 0 3h-21a1.5 1.5 0 0 1 0-3zm0 8h21a1.5 1.5 0 0 1 0 3h-21a1.5 1.5 0 0 1 0-3zm0 8h21a1.5 1.5 0 0 1 0 3h-21a1.5 1.5 0 0 1 0-3z" />
    </SVG.Svg>
  );
}

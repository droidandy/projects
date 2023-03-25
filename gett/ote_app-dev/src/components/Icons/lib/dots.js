import React from 'react';
import * as SVG from 'react-native-svg';

export default function Dots({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 26 26" {...rest}>
      <SVG.Path fill={color || '#373737' } d="M7.5 13.035a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zm7 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zm7 0a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0z" />
    </SVG.Svg>
  );
}

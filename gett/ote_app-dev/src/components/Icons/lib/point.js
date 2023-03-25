import React from 'react';
import * as SVG from 'react-native-svg';

export default function Point({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 16 16" {...rest}>
      <SVG.G fill="none" fillRule="nonzero">
        <SVG.Circle cx="8" cy="8" r="6" fill="#fff" />
        <SVG.Path fill={color || '#00C46B'} d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zm0-5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      </SVG.G>
    </SVG.Svg>
  );
}

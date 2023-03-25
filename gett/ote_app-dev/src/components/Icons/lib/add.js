import React from 'react';
import * as SVG from 'react-native-svg';

export default function Add({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 22 22" {...rest}>
      <SVG.G fill="none" fillRule="nonzero">
        <SVG.Path fill="#BBBBBF" d="M11 20.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zm0 1.5C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11z" />
        <SVG.Path fill={color || '#373737' } d="M11.75 10.25h2.5a.75.75 0 1 1 0 1.5h-2.5v2.5a.75.75 0 1 1-1.5 0v-2.5h-2.5a.75.75 0 1 1 0-1.5h2.5v-2.5a.75.75 0 1 1 1.5 0v2.5z" />
      </SVG.G>
    </SVG.Svg>
  );
}

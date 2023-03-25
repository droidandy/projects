import React from 'react';
import * as SVG from 'react-native-svg';

export default function Info({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 22 22" {...rest}>
      <SVG.Path fill={color || '#373737'} fillRule="nonzero" d="M9 8.5h3v8h1v.5H9v-.5h1V9H9v-.5zM10.75 7a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zM11 20.5a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19zm0 1.5C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11z" />
    </SVG.Svg>
  );
}

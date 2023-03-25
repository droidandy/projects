import React from 'react';
import * as SVG from 'react-native-svg';

export default function Drag({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 14 8" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M.75 0h12.5a.75.75 0 0 1 .75.75v.1a.75.75 0 0 1-.75.75H.75A.75.75 0 0 1 0 .85v-.1A.75.75 0 0 1 .75 0zm0 3.2h12.5a.75.75 0 0 1 .75.75v.1a.75.75 0 0 1-.75.75H.75A.75.75 0 0 1 0 4.05v-.1a.75.75 0 0 1 .75-.75zm0 3.2h12.5a.75.75 0 0 1 .75.75v.1a.75.75 0 0 1-.75.75H.75A.75.75 0 0 1 0 7.25v-.1a.75.75 0 0 1 .75-.75z" />
    </SVG.Svg>
  );
}

import React from 'react';
import * as SVG from 'react-native-svg';

export default function Push({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 24" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M21 12v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h8v1.501H4.009c-1.527 0-2.512 1.056-2.512 2.509v12.987c0 1.111.806 2.53 2.512 2.53h13.004c1.23 0 2.464-.6 2.464-2.53V12H21zm-2-3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
    </SVG.Svg>
  );
}

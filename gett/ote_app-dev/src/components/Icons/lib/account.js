import React from 'react';
import * as SVG from 'react-native-svg';

export default function Account({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 17 22" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M2.671 0h8.074L17 6.59v12.596C17 20.736 15.8 22 14.329 22H2.662C1.192 22 0 20.736 0 19.186L.01 2.814C.01 1.264 1.2 0 2.67 0zm7.47 1.535h-7.47c-.663 0-1.204.574-1.204 1.279l-.01 16.372c0 .705.541 1.28 1.205 1.28h11.667c.666 0 1.214-.578 1.214-1.28V7.225l-5.402-5.69zm5.426 4.864v1.535H9.496V1.539h1.457v4.86h4.614z" />
    </SVG.Svg>
  );
}

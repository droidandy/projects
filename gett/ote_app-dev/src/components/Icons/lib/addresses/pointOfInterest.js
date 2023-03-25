import React from 'react';
import * as SVG from 'react-native-svg';

export default function PointOfInterest({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 18 21" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M15.445 1.5H1.527v8.053h13.918l-2.204-4.027L15.445 1.5zM1.527 11.053V21H0V0h18l-3.025 5.526L18 11.053H1.527z" />
    </SVG.Svg>
  );
}

import React from 'react';
import * as SVG from 'react-native-svg';

export default function DottedLine({ pointsNum = 4, color, ...rest }) {
  const render4Dots = () => (
    <SVG.Svg viewBox="0 0 2 14" {...rest}>
      <SVG.Path fill={color || '#A0A0A0'} fillRule="nonzero" d="M1 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </SVG.Svg>
  );

  const render5Dots = () => (
    <SVG.Svg viewBox="0 0 2 18" {...rest}>
      <SVG.Path fill={color || '#A0A0A0'} fillRule="nonzero" d="M1 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </SVG.Svg>
  );

  const render9Dots = () => (
    <SVG.Svg viewBox="0 0 2 34" {...rest}>
      <SVG.Path fill={color || '#A0A0A0'} fillRule="nonzero" d="M1 16a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM1 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </SVG.Svg>
  );

  if (pointsNum === 5) {
    return render5Dots();
  } if (pointsNum === 9) {
    return render9Dots();
  }
  return render4Dots();
}

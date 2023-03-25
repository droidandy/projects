import React from 'react';
import * as SVG from 'react-native-svg';

export default function Calendar({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 24" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M4 3.5A2.5 2.5 0 0 0 1.5 6v14A2.5 2.5 0 0 0 4 22.5h16a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 20 3.5H4zM4 2h16a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm2.75-2a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 6.75 0zm10.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 1 1-1.5 0V.75a.75.75 0 0 1 .75-.75zm-.348 9.073a.75.75 0 0 1 1.03 1.09l-6.96 6.575a.75.75 0 0 1-1.014.014l-4.235-3.785a.75.75 0 1 1 1-1.119l3.72 3.327 6.46-6.102z" />
    </SVG.Svg>
  );
}

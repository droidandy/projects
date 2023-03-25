import React from 'react';
import * as SVG from 'react-native-svg';

export default function CalendarRange({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 24" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M4 3.5A2.5 2.5 0 0 0 1.5 6v14A2.5 2.5 0 0 0 4 22.5h16a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 20 3.5H4zM4 2h16a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zm2.75-2a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 6.75 0zm10.5 0a.75.75 0 0 1 .75.75v4.5a.75.75 0 1 1-1.5 0V.75a.75.75 0 0 1 .75-.75zM17 9h2v2h-2V9zm0 4h2v2h-2v-2zm-4-4h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zM9 9h2v2H9V9zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm-4-4h2v2H5v-2zm0 4h2v2H5v-2z" />
    </SVG.Svg>
  );
}

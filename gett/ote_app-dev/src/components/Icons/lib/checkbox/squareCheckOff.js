import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export default function SquareCheckOff({ color, ...rest }) {
  return (
    <Svg viewBox="0 0 26 26" {...rest}>
      <G fill="none" fillRule="evenodd">
        <Path fill="#BBBBBF" d="M5 4.5a.5.5 0 0 0-.5.5v16a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5zM5 3h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      </G>
    </Svg>
  );
}

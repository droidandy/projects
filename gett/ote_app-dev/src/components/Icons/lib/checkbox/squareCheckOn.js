import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export default function SquareCheckOn({ color, ...rest }) {
  return (
    <Svg viewBox="0 0 26 26" {...rest}>
      <G fill="none" fillRule="evenodd">
        <Path fill="#BBBBBF" d="M21.5 10.209L23 8.884V21a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 1.891 1.347L21.5 5.557V5a.5.5 0 0 0-.5-.5H5a.5.5 0 0 0-.5.5v16a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5V10.209z"/>
        <Path fill="#FFFFFF" d="M23 5.272V7.83l-10.222 9.812-4.632-4.472 1.373-1.4 3.26 3.175z"/>
      </G>
    </Svg>
  );
}

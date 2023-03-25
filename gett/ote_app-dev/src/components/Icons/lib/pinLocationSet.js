import React from 'react';
import * as SVG from 'react-native-svg';

export default function PinLocationSet({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 26 42" {...rest}>
      <SVG.G fill="none" fillRule="evenodd">
        <SVG.Circle cx="13" cy="12" r="5" fill="#FFF" />
        <SVG.Path fill={color || '#00C46B'} fillRule="nonzero" d="M14 23.959V41a1 1 0 0 1-2 0V23.959C5.84 23.45 1 18.29 1 12 1 5.373 6.373 0 13 0s12 5.373 12 12c0 6.29-4.84 11.45-11 11.959zM13 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z" />
      </SVG.G>
    </SVG.Svg>
  );
}

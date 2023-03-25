import React from 'react';
import * as SVG from 'react-native-svg';

export default function CheckOn({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 22 22" {...rest}>
      <SVG.G fill="none" fillRule="nonzero">
        <SVG.Circle cx="11" cy="11" r="11" fill={color || '#A0A0A0'} />
        <SVG.Path fill="#FFF" d="M16.305 7l.695.702L8.788 16 5 12.172l.695-.702 3.093 3.125z" />
      </SVG.G>
    </SVG.Svg>
  );
}

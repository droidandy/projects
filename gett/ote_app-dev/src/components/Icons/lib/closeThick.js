import React from 'react';
import * as SVG from 'react-native-svg';

export default function CloseThick({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 20 20" {...rest}>
      <SVG.Path fill="#FF3636" fillRule="nonzero" d="M10 12.424l-7.273 7.273-2.424-2.424L7.576 10 .303 2.727 2.727.303 10 7.576 17.273.303l2.424 2.424L12.424 10l7.273 7.273-2.424 2.424L10 12.424z" />
    </SVG.Svg>
  );
}

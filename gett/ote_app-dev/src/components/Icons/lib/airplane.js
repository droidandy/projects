import React from 'react';
import * as SVG from 'react-native-svg';

export default function Airplane({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 22" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M21.405 9.091l-5.001.029L10.42.049 8.4.053l2.985 9.078-6.216.015-2.268-3.229-2.121.005 1.824 5.083L.9 16.1l2.019-.004 2.231-3.256 6.24.009-3.01 9.074 2.019-.005 6.026-9.098 4.984-.012a1.86 1.86 0 0 0 1.858-1.857c-.003-1.021-.84-1.869-1.86-1.86z" />
    </SVG.Svg>
  );
}

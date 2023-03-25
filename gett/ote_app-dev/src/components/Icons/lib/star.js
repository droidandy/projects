import React from 'react';
import * as SVG from 'react-native-svg';

export default function Star({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 24 23" {...rest}>
      <SVG.Path fill={color || '#FDB924'} fillRule="nonzero" d="M5.534 22.897a.878.878 0 0 1-1.272-.928l1.235-7.228L.266 9.623A.881.881 0 0 1 .752 8.12L7.98 7.067 11.213.49a.876.876 0 0 1 1.574 0l3.232 6.576 7.23 1.054a.881.881 0 0 1 .485 1.502l-5.23 5.118 1.234 7.228a.878.878 0 0 1-1.272.928L12 19.485l-6.466 3.412z" />
    </SVG.Svg>
  );
}

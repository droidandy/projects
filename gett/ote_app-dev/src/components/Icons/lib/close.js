import React from 'react';
import * as SVG from 'react-native-svg';

export default function Close({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 14 14" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M6.982 5.948L12.326.604c.27-.27.709-.27.98 0l.081.081c.27.27.27.709 0 .98L8.043 7.007l5.344 5.344c.27.27.27.71 0 .98l-.082.081a.692.692 0 0 1-.979 0L6.982 8.07l-5.344 5.344a.692.692 0 0 1-.979 0l-.082-.081a.692.692 0 0 1 0-.98l5.345-5.344L.577 1.664a.692.692 0 0 1 0-.979L.66.604c.27-.27.709-.27.98 0l5.343 5.344z" />
    </SVG.Svg>
  );
}

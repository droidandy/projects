import Svg, { Path } from 'react-native-svg';
import { iconFillStyle } from '../../helpers/theme';
import React from 'react';
import { SvgIconProps } from './types';

export const PharmaciesIcon = ({ active = false, width = 16.5, height = 22 }: SvgIconProps) => {
  return (
    <Svg height={height} width={width} viewBox="0 0 384 512">
      <Path
        {...iconFillStyle(active)}
        d="M192 0C86.4 0 0 86.4 0 192c0 76.8 25.6 99.2 172.8 310.4 9.6 12.8 28.8 12.8 38.4 0C358.4 291.2 384 268.8 384 192 384 86.4 297.6 0 192 0zm112 200c0 8.84-7.16 16-16 16h-72v72c0 8.84-7.16 16-16 16h-16c-8.84 0-16-7.16-16-16v-72H96c-8.84 0-16-7.16-16-16v-16c0-8.84 7.16-16 16-16h72V96c0-8.84 7.16-16 16-16h16c8.84 0 16 7.16 16 16v72h72c8.84 0 16 7.16 16 16v16z"
      />
    </Svg>
  );
};

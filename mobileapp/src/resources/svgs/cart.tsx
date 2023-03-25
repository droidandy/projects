import Svg, { Path, Text } from 'react-native-svg';
import { iconFillStyle } from '../../helpers/theme';
import React from 'react';
import { SvgIconProps } from './types';

export const CartIcon = ({ active = false, width = 26, height = 26 }: SvgIconProps) => {
  return (
    <Svg height={height} width={width} viewBox="-10 0 1684 1792">
      <Path
        {...iconFillStyle(active)}
        d="M640 1536q0 52 -38 90t-90 38t-90 -38t-38 -90t38 -90t90 -38t90 38t38 90zM1536 1536q0 52 -38 90t-90 38t-90 -38t-38 -90t38 -90t90 -38t90 38t38 90zM1664 448v512q0 24 -16.5 42.5t-40.5 21.5l-1044 122q13 60 13 70q0 16 -24 64h920q26 0 45 19t19 45t-19 45 t-45 19h-1024q-26 0 -45 -19t-19 -45q0 -11 8 -31.5t16 -36t21.5 -40t15.5 -29.5l-177 -823h-204q-26 0 -45 -19t-19 -45t19 -45t45 -19h256q16 0 28.5 6.5t19.5 15.5t13 24.5t8 26t5.5 29.5t4.5 26h1201q26 0 45 19t19 45z"
      />
      <Text />
    </Svg>
  );
};

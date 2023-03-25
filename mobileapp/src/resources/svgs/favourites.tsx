import Svg, { Path, Text } from 'react-native-svg';
import { iconFillStyle } from '../../helpers/theme';
import React from 'react';
import { SvgIconProps } from './types';

export const FavouritesIcon = ({ active = false, width = 26, height = 26 }: SvgIconProps) => {
  return (
    <Svg height={height} width={width} viewBox="-10 0 1812 1792">
      <Path
        {...iconFillStyle(active)}
        d="M896 1664q-26 0 -44 -18l-624 -602q-10 -8 -27.5 -26t-55.5 -65.5t-68 -97.5t-53.5 -121t-23.5 -138q0 -220 127 -344t351 -124q62 0 126.5 21.5t120 58t95.5 68.5t76 68q36 -36 76 -68t95.5 -68.5t120 -58t126.5 -21.5q224 0 351 124t127 344q0 221 -229 450l-623 600
q-18 18 -44 18z"
      />
      <Text />
    </Svg>
  );
};

import Svg, { Path } from 'react-native-svg';
import { iconFillStyle } from '../../helpers/theme';
import React from 'react';
import { SvgIconProps } from './types';

export const MenuIcon = ({ active = false, height = 26, width = 26 }: SvgIconProps) => {
  return (
    <Svg height={height} width={width} viewBox="0 0 448 512">
      <Path
        {...iconFillStyle(active)}
        d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      />
    </Svg>
  );
};

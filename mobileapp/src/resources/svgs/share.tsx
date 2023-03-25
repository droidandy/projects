import Svg, { Path, Text } from 'react-native-svg';
import { iconFillStyle } from '../../helpers/theme';
import React from 'react';
import { SvgIconProps } from './types';

export const ShareIcon = ({ active = false, width = 18.5, height = 18.5 }: SvgIconProps) => {
  return (
    <Svg height={height} width={width} viewBox="0 0 18.5 18.5">
      <Path
        fill="#979797"
        d="M18.18,14.647a2.881,2.881,0,0,0-2.078.882L8.316,11.636a2.892,2.892,0,0,0,0-.915L16.1,6.827a2.89,2.89,0,1,0-.813-2.008,2.911,2.911,0,0,0,.036.458L7.539,9.17a2.891,2.891,0,1,0,0,4.017l7.787,3.893a2.891,2.891,0,1,0,2.854-2.433Z"
        transform="translate(-2.571 -1.928)"
      />
      <Text />
    </Svg>
  );
};

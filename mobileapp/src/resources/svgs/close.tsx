import Svg, { Path, Text } from 'react-native-svg';
import React from 'react';
import { SvgIconProps } from './types';

export const CloseIcon = ({
  fill = '#b1b1b1',
  width = 11,
  height = 11,
}: SvgIconProps & { fill?: string }) => {
  return (
    <Svg height={height} width={width} viewBox="0 0 10.752 10.752">
      <Path
        d="M18.252,8.583,17.169,7.5l-4.293,4.293L8.583,7.5,7.5,8.583l4.293,4.293L7.5,17.169l1.083,1.083,4.293-4.293,4.293,4.293,1.083-1.083-4.293-4.293Z"
        transform="translate(-7.5 -7.5)"
        fill={fill}
      />
    </Svg>
  );
};

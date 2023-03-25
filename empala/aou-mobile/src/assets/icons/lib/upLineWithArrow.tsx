import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  fillColor?: string;
};

const upLineWithArrow = ({ fillColor = '#10B981' }: Props): JSX.Element => (
  <Svg viewBox="0 0 18 18" fill="none">
    <Path d="M12 4.5L13.7175 6.2175L10.0575 9.8775L7.0575 6.8775L1.5 12.4425L2.5575 13.5L7.0575 9L10.0575 12L14.7825 7.2825L16.5 9V4.5H12Z" fill={fillColor} />
  </Svg>
);

export default upLineWithArrow;

import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  fillColor?: string;
};

const downLineWithArrow = ({ fillColor = '#F43F5E' }: Props): JSX.Element => (
  <Svg viewBox="0 0 18 18" fill="none">
    <Path d="M12 13.5L13.7175 11.7825L10.0575 8.1225L7.0575 11.1225L1.5 5.5575L2.5575 4.5L7.0575 9L10.0575 6L14.7825 10.7175L16.5 9V13.5H12Z" fill={fillColor} />
  </Svg>
);

export default downLineWithArrow;

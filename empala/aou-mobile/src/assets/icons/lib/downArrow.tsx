import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

type Props = {
  style: StyleProp<ViewStyle>;
};

const downArrow = ({ style } : Props): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={style}>
    <G opacity="0.5">
      <Path d="M7 10L12 15L17 10H7Z" fill="#0F172A" />
    </G>
  </Svg>
);

export default downArrow;

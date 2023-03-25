import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Cover({ color = '#245CC0', ...rest }) {
  return (
    <Svg viewBox="0 0 375 435" {...rest}>
      <Path
        d="M0 0L151.076 70.7413C157.107 73.5653 163.237 75.5566 169.364 76.7802C186.334 81.5155 205.2 80.5813 223.212 72.2477L375 2.01978V434.076H0V0Z"
        fill={color}
      />
    </Svg>
  );
}

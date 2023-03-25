import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Pause({ color = '#fff', ...rest }) {
  return (
    <Svg viewBox="0 0 16 25" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3.17988C5 1.79917 3.88071 0.679878 2.5 0.679878C1.11929 0.679878 0 1.79917 0 3.17988V22.1799C0 23.5606 1.11929 24.6799 2.5 24.6799C3.88071 24.6799 5 23.5606 5 22.1799L5 3.17988ZM16 3.17988C16 1.79917 14.8807 0.679878 13.5 0.679878C12.1193 0.679878 11 1.79917 11 3.17988L11 22.1799C11 23.5606 12.1193 24.6799 13.5 24.6799C14.8807 24.6799 16 23.5606 16 22.1799L16 3.17988Z"
        fill={color}
      />
    </Svg>
  );
}

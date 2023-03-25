import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export default function OrderType({ ...rest }): JSX.Element {
  return (
    <Svg width="27" height="27" viewBox="0 0 27 27" fill="none" {...rest}>
      <Rect width="27" height="27" fill="#E2E8F0" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.1816 6.08325C21.1537 6.08325 21.949 6.87492 21.949 7.84251V20.1573C21.949 21.1249 21.1537 21.9166 20.1816 21.9166H7.81008C6.83804 21.9166 6.04272 21.1249 6.04272 20.1573V7.84251C6.04272 6.87492 6.83804 6.08325 7.81008 6.08325H20.1816ZM13.1122 17.967L10.903 15.3194L7.81008 19.2777H20.1816L16.205 13.9999L13.1122 17.967Z"
        fill="#94A3B8"
      />
    </Svg>
  );
}

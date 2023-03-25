import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  style: StyleProp<ViewStyle>;
};

export default function FilterArrow({ style }: Props) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <Path fillRule="evenodd" clipRule="evenodd" d="M1.3335 7.99992C1.3335 4.31992 4.32016 1.33325 8.00016 1.33325C11.6802 1.33325 14.6668 4.31992 14.6668 7.99992C14.6668 11.6799 11.6802 14.6666 8.00016 14.6666C4.32016 14.6666 1.3335 11.6799 1.3335 7.99992ZM5.3335 7.33325L8.00016 9.99992L10.6668 7.33325H5.3335Z" fill="#475569" />
    </Svg>
  );
}

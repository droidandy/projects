import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export const ImagePlaceholder = ({ style }: Props): JSX.Element => (
  <Svg width="25" height="23" viewBox="0 0 25 23" fill="none" style={style}>
    <Rect width="24.4502" height="19" transform="translate(0 1.5)" fill="#E2E8F0" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M18.1818 3.58325C19.1539 3.58325 19.9492 4.37492 19.9492 5.34251V17.6573C19.9492 18.6249 19.1539 19.4166 18.1818 19.4166H5.81033C4.83828 19.4166 4.04297 18.6249 4.04297 17.6573V5.34251C4.04297 4.37492 4.83828 3.58325 5.81033 3.58325H18.1818ZM11.1124 15.467L8.90321 12.8194L5.81033 16.7777H18.1818L14.2053 11.4999L11.1124 15.467Z" fill="#94A3B8" />
  </Svg>
);

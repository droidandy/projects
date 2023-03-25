import React from 'react';
import { View, ViewStyle } from 'react-native';

import { Icon } from './Icon';
import { IconProps } from './types';

type Props = {
  style?: ViewStyle,
} & IconProps;

export const IconContainer = ({ style, ...rest }: Props): JSX.Element => (
  <View style={style}>
    <Icon {...rest} />
  </View>
);

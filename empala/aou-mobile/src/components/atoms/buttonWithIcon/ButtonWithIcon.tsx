import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';

import * as s from './buttonWithIconStyles';

import { Icon } from '~/components/atoms/icon';

type Props = {
  icon: string,
  size?: number,
  color?: string,
  text?: string,
  textStyle?: StyleProp<TextStyle>,
  onPress: () => void,
};

export const ButtonWithIcon = ({
  icon, size = 24, color = 'white', text, textStyle, onPress,
}: Props): JSX.Element => (
  <s.Container onPress={onPress}>
    <Icon name={icon} size={size} color={color} />
    {text && <Text style={textStyle}>{text}</Text>}
  </s.Container>
);

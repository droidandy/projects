import React from 'react';
import { StyleProp, TouchableOpacityProps } from 'react-native';

import * as s from './styles';

import { ChartModeSwitcherIcon } from '~/assets/icons';

type Props = {
  style?: StyleProp<TouchableOpacityProps>;
  onToggle: () => void;
};

export const ChartModeSwitcher = ({ style, onToggle }: Props): JSX.Element => (
  <s.Wrapper style={style} onPress={onToggle}>
    <ChartModeSwitcherIcon />
  </s.Wrapper>
);

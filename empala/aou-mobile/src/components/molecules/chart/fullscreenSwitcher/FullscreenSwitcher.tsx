import React from 'react';
import { StyleProp, TouchableOpacityProps } from 'react-native';

import * as s from './styles';

import { FullscreenSwitcherIcon } from '~/assets/icons';

type Props = {
  style?: StyleProp<TouchableOpacityProps>;
  onToggle: () => void;
};

export const FullscreenSwitcher = ({ style, onToggle }: Props): JSX.Element => (
  <s.Wrapper style={style} onPress={onToggle}>
    <FullscreenSwitcherIcon />
  </s.Wrapper>
);

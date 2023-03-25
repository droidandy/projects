import React from 'react';
import { StyleProp, TouchableOpacityProps } from 'react-native';

import { Wrapper } from './styles';

import { SwitcherOffIcon, SwitcherOnIcon } from '~/assets/icons';

type Props = {
  enabled: boolean;
  style?: StyleProp<TouchableOpacityProps>;
};

export const Switcher = ({ enabled, style }: Props): JSX.Element => (
  <Wrapper style={style}>
    {enabled ? <SwitcherOnIcon /> : <SwitcherOffIcon />}
  </Wrapper>
);

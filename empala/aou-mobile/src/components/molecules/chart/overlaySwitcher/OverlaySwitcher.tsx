import React from 'react';
import { StyleProp, TouchableOpacityProps } from 'react-native';

import * as s from './styles';

type Props = {
  enabled: boolean;
  style?: StyleProp<TouchableOpacityProps>;
  onToggle: () => void;
};

export const OverlaySwitcher = ({ enabled, style, onToggle }: Props): JSX.Element => (
  <s.Wrapper style={style} onPress={onToggle}>
    <s.Switcher enabled={enabled} />
    <s.Label>
      <s.LabelText>Overlays</s.LabelText>
      <s.LabelUnderline />
    </s.Label>
  </s.Wrapper>
);

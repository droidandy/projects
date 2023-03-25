import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './SeparatorLine.styles';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const SeparatorLineBase: React.FC<Props> = ({ style }: Props) => {
  return <View key="container" style={[styles.container, style]} />;
};

export const SeparatorLine = React.memo<Props>(SeparatorLineBase);

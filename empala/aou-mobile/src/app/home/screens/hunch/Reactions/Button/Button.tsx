import React, { useCallback } from 'react';
import { StyleProp, TouchableOpacityProps } from 'react-native';

import * as s from './styles';

type Props = {
  id?: string;
  icon: React.ReactElement
  label: string | number;
  style?: StyleProp<TouchableOpacityProps>;
  onPress?: (id?: string) => void;
};

export const Button = ({
  id,
  icon,
  label,
  style,
  onPress,
}: Props): React.ReactElement => {
  const handlePress = useCallback(() => {
    onPress?.(id);
  }, [id, onPress]);

  return (
    <s.Wrapper style={style} onPress={handlePress}>
      {icon}
      <s.Count>{label}</s.Count>
    </s.Wrapper>
  );
};

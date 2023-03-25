import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';

import { ReactValidNode } from '../../helpers/types';

import { styles } from './SegmentedControl.styles';

interface Props {
  value: string;
  label: ReactValidNode | ((active: boolean) => ReactValidNode);
  style?: ViewStyle;
  isSelected: boolean;
  first?: boolean;
  last?: boolean;

  onPress?(value: string): void;
}

const SegmentBase: React.FC<Props> = ({
  value,
  label,
  style,
  isSelected,
  first,
  last,
  onPress,
}: Props) => {
  const onPressAction = isSelected ? undefined : () => (onPress ? onPress(value) : undefined);
  return (
    <TouchableOpacity
      key="container"
      style={[
        styles.segment,
        isSelected ? styles.segmentActive : undefined,
        first ? styles.segmentFirst : undefined,
        last ? styles.segmentLast : undefined,
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPressAction}
    >
      {typeof label === 'string' ? (
        <Text style={isSelected ? styles.segmentActiveText : styles.segmentText}>{label}</Text>
      ) : typeof label === 'function' ? (
        label(isSelected)
      ) : (
        label
      )}
    </TouchableOpacity>
  );
};

export const Segment = React.memo<Props>(SegmentBase);

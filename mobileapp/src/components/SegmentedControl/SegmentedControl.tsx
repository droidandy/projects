import React, { useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { ReactValidNode } from '../../helpers/types';

import { Segment } from './Segment';
import { styles } from './SegmentedControl.styles';

interface Item {
  value: string;
  label: ReactValidNode | ((active: boolean) => ReactValidNode);
  style?: ViewStyle;
}

interface Props {
  items: Item[];
  style?: ViewStyle;
  defaultItem?: Item['value'];
  onChange?(value: Item['value']): void;
}

const SegmentedControlBase: React.FC<Props> = ({ style, items, defaultItem, onChange }: Props) => {
  const [selected, setSelected] = useState<string>(defaultItem ?? items[0]?.value);
  const onPress = React.useMemo<(value: Item['value']) => void>(
    () => (value): void => {
      setSelected(value);
      if (onChange) {
        onChange(value);
      }
    },
    [onChange, setSelected],
  );
  const lastItemIndex = items.length - 1;

  return (
    <View key="control" style={[styles.container, style]}>
      {items.map((item, index) => (
        <Segment
          {...item}
          key={item.value}
          isSelected={selected === item.value}
          onPress={onPress}
          first={index === 0}
          last={index === lastItemIndex}
        />
      ))}
    </View>
  );
};

export const SegmentedControl = React.memo<Props>(SegmentedControlBase);

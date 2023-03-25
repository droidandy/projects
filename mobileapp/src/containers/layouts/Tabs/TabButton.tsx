import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { styles, inactiveTabGradientColors } from './Tabs.styles';

interface Props {
  name: string;
  selected?: boolean;
  onPress(name: string): void;
}

const TabButtonBase: React.FC<Props> = ({
  name,
  selected,
  onPress,
  children,
}: React.PropsWithChildren<Props>) => {
  const onPressMemoized = useMemo<() => void>(() => (): void => onPress(name), [name, onPress]);
  const childrenType = typeof children;

  return (
    <TouchableOpacity key={name} onPress={onPressMemoized} style={styles.tabButton}>
      <View key="label" style={styles.tabButtonLabel}>
        {childrenType === 'string' || childrenType === 'number' ? (
          <Text>{children}</Text>
        ) : (
          children
        )}
      </View>
      {selected ? (
        <View key="active" style={styles.tabAdornmentActive} />
      ) : (
        <LinearGradient
          key="inactive"
          colors={inactiveTabGradientColors}
          style={styles.tabAdornment}
        />
      )}
    </TouchableOpacity>
  );
};

export const TabButton = React.memo<React.PropsWithChildren<Props>>(TabButtonBase);

import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { styles } from './BasketLink.styles';
import React from 'react';

interface BadgeProps {
  count?: number;
  position?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
}

export const Badge = ({ count, position, textStyle, style }: BadgeProps) => {
  if (!count || count < 1) return null;
  const text = count > 99 ? '99+' : count;
  return (
    <View
      key="badge"
      style={[styles.badge, position === 'left' ? styles.leftBadge : styles.rightBadge, style]}
    >
      <Text style={[styles.badgeText, textStyle]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

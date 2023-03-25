import React, { PropsWithChildren } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

import { formItemStyles } from './FormItem.style';

export interface FormItemProps extends PropsWithChildren<{}> {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export interface FormItemCommonProps {
  itemStartAdornment?: FormItemProps['startAdornment'];
  itemEndAdornment?: FormItemProps['endAdornment'];
  itemStyle?: FormItemProps['style'];
}

export const FormItem: React.FC<FormItemProps> = ({
  style,
  startAdornment,
  endAdornment,
  children,
}: FormItemProps) => (
  <View style={[formItemStyles.container, style]}>
    {startAdornment}
    {children}
    {endAdornment}
  </View>
);

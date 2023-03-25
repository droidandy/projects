import * as React from 'react';
import {
  StyleProp,
  Text,
  TouchableHighlightProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { theme } from '../../../helpers/theme';

import { Loader } from '../../Loader/Loader';

import { buttonStyles } from './Button.style';

export interface ButtonProps extends TouchableHighlightProps {
  title: string;
  type?: 'filled' | 'outlined' | 'squared' | 'squared-white';
  startAdornment?: React.ReactNode | null;
  endAdornment?: React.ReactNode | null;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

const loader = (
  <View key="loader" style={{ marginVertical: theme.sizing(-0.6), marginRight: theme.sizing(1) }}>
    <Loader size="small" color="white" />
  </View>
);
const greenLoader = (
  <View key="loader" style={{ marginRight: theme.sizing(1) }}>
    <Loader size="small" color="green" />
  </View>
);

export const Button: React.FC<ButtonProps> = ({
  title,
  style,
  type,
  startAdornment,
  endAdornment,
  loading,
  disabled,
  onPress,
  ...rest
}: ButtonProps) => {
  let customStyle;
  let customTextStyle;

  switch (type) {
    case 'filled':
      customStyle = buttonStyles.button;
      customTextStyle = buttonStyles.text;
      break;
    case 'outlined':
      customStyle = buttonStyles.buttonOutlined;
      customTextStyle = buttonStyles.textOutlined;
      break;
    case 'squared':
      customStyle = buttonStyles.buttonSquared;
      customTextStyle = buttonStyles.textSquared;
      break;
    case 'squared-white':
      customStyle = buttonStyles.buttonSquaredWhite;
      customTextStyle = buttonStyles.textSquaredWhite;
      break;
  }

  return (
    <TouchableOpacity
      {...rest}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : theme.opacity.active}
      style={[style, customStyle, disabled ? buttonStyles.buttonDisabled : undefined]}
    >
      {!loading && startAdornment}
      {loading ? (type === 'outlined' ? greenLoader : loader) : null}
      <Text style={customTextStyle}>{title}</Text>
      {endAdornment}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  type: 'filled',
} as Partial<ButtonProps>;

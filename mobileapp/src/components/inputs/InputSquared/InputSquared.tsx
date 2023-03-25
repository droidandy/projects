import { TextInput, TextInputProps, TextStyle, View } from 'react-native';
import React from 'react';
import { theme } from '../../../helpers/theme';

import { styles } from './InputSquared.styles';

interface InputSquaredProps extends TextInputProps {
  inputStyle?: TextStyle;
  style?: TextStyle;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const InputSquared = React.forwardRef<TextInput, InputSquaredProps>(
  // eslint-disable-next-line react/prop-types
  ({ style, inputStyle, startAdornment = null, endAdornment = null, ...rest }, ref) => (
    <View key="container" style={[styles.container, style]}>
      {startAdornment}
      <TextInput
        key="input"
        ref={ref}
        style={[styles.input, inputStyle]}
        placeholderTextColor={theme.lightGray}
        {...rest}
      />
      {endAdornment}
    </View>
  ),
);

InputSquared.displayName = 'InputSquared';

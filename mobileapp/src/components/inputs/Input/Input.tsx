import React, { useCallback, useState } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';

import { theme } from '../../../helpers/theme';

import { inputStyle } from './Input.style';

export interface InputProps extends TextInputProps {
  required?: boolean;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  error: propsError,
  onBlur,
  required,
  onChangeText,
  value,
  ...rest
}: InputProps) => {
  const [localValue, setLocalValue] = useState(rest.defaultValue ? rest.defaultValue : value);
  const [touched, setTouched] = useState<boolean>(false);

  const hasError = touched
    ? propsError === undefined
      ? required
        ? !localValue
        : false
      : propsError
    : false;

  const style: StyleProp<TextStyle> = [inputStyle.input, hasError && inputStyle.error, rest.style];
  const inputTextStyle = !hasError ? inputStyle.inputTextDefault : inputStyle.inputTextError;
  const textColor = !hasError ? theme.green : theme.red;
  const placeholderColor = !hasError ? theme.placeholder : theme.red;

  const onBlurCustom = useCallback(
    (e: any): any => {
      setTouched(true);

      if (typeof onBlur === 'function') {
        onBlur(e);
      }
    },
    [onBlur],
  );

  const onChangeTextCustom = useCallback(
    (newValue: string): void => {
      setLocalValue(newValue);

      if (typeof onChangeText === 'function') {
        onChangeText(newValue);
      }
    },
    [onChangeText],
  );

  const styleResult: StyleProp<TextStyle> = [
    rest.style,
    style,
    inputTextStyle,
    rest.editable === false ? inputStyle.inputNoEditable : undefined,
  ];

  return (
    <TextInput
      placeholderTextColor={placeholderColor}
      selectionColor={textColor}
      {...rest}
      value={value === undefined ? localValue : value}
      onBlur={onBlurCustom}
      onChangeText={onChangeTextCustom}
      style={styleResult}
    />
  );
};

import { StyleSheet, ViewStyle } from 'react-native';

import { theme } from '../../../helpers/theme';

const textStyle = {
  fontFamily: theme.fonts.normal,
  fontSize: 14,
};

const commonContainerStyle = {
  flex: 0,
  flexDirection: 'row' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
};

const getContainerStyle = (borderWidth: number): ViewStyle => ({
  ...commonContainerStyle,
  borderRadius: 40,
  paddingTop: theme.sizing(1.5) - borderWidth,
  paddingBottom: theme.sizing(1.5) - borderWidth,
  paddingLeft: theme.sizing(3) - borderWidth,
  paddingRight: theme.sizing(3) - borderWidth,
});

export const buttonStyles = StyleSheet.create({
  buttonDisabled: {
    backgroundColor: theme.grayDisabled,
  },
  button: {
    ...getContainerStyle(0),
    backgroundColor: theme.green,
  },
  buttonOutlined: {
    ...getContainerStyle(1),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: theme.green,
  },
  buttonSquared: {
    ...commonContainerStyle,
    backgroundColor: theme.green,
    borderRadius: theme.sizing(2),
    paddingVertical: theme.sizing(2),
  },
  buttonSquaredWhite: {
    ...commonContainerStyle,
    backgroundColor: '#fff',
    borderRadius: theme.sizing(2),
    paddingVertical: theme.sizing(2),
  },
  text: {
    ...textStyle,
    color: '#fff',
  },
  textOutlined: {
    ...textStyle,
    color: theme.green,
  },
  textSquared: {
    ...textStyle,
    fontSize: 20,
    color: '#fff',
  },
  textSquaredWhite: {
    ...textStyle,
    fontSize: 20,
    color: theme.green,
  },
});

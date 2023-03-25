import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const inputStyle = StyleSheet.create({
  input: {
    fontFamily: theme.fonts.light,
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: theme.sizing(2),
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 24,
    height: theme.sizing(6),
  },
  inputNoEditable: {
    backgroundColor: theme.border,
    color: theme.placeholder,
  },
  inputTextDefault: {
    color: theme.green,
  },
  inputTextError: {
    color: theme.red,
  },
  error: {
    borderColor: theme.red,
  },
});

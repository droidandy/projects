import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    flex: 1,
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

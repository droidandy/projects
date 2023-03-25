import { Platform, StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: theme.screenPadding.vertical,
    paddingHorizontal: theme.screenPadding.horizontal,
  },
  footer: {
    backgroundColor: theme.white,
    borderTopColor: theme.border,
    borderTopWidth: Platform.OS === 'ios' ? 1 : 0,
    elevation: 8,
    flexShrink: 0,
  },
  footerTopAdornment: {
    paddingHorizontal: theme.screenPadding.horizontal,
  },
});

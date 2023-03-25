import { Platform, StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childContainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: theme.screenPadding.horizontal,
  },
  footer: {
    backgroundColor: theme.white,
    borderTopColor: theme.border,
    borderTopWidth: Platform.OS === 'ios' ? 1 : 0,
    elevation: 8,
  },
  footerTopAdornment: {
    paddingHorizontal: theme.screenPadding.horizontal,
  },
});

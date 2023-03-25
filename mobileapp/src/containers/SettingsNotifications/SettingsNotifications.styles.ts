import { Platform, StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    marginBottom: theme.sizing(3),
    marginHorizontal: theme.sizing(4),
  },
  bottomButton: {
    marginTop: theme.sizing(2),
  },
  switcher: {
    marginLeft: theme.sizing(1.5),
  },
  separators: {
    marginVertical: theme.sizing(Platform.OS === 'ios' ? 1.5 : 1),
  },
});

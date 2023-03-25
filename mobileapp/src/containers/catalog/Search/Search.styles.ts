import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: theme.sizing(3),
  },
  noData: {
    color: theme.green,
    fontSize: 18,
  },
});

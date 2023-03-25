import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  separator: {
    width: '100%',
    marginTop: theme.sizing(2),
    marginBottom: theme.sizing(2),
  },
});

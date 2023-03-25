import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  scrollContentStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noData: {
    textAlign: 'center',
    color: theme.green,
    fontSize: 18,
  },
  error: {
    textAlign: 'center',
    fontSize: 18,
  },
  refetchButton: {
    marginTop: theme.sizing(2),
  },
});

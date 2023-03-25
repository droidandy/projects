import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    display: 'flex',
  },
  paginationContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    flexWrap: 'wrap',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.green,
    marginTop: theme.sizing(1),
  },
  paginationDotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.green,
    backgroundColor: '#fff',
    marginTop: theme.sizing(1),
  },
});

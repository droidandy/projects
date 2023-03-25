import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const formItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.sizing(2),
  },
});

import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.sizing(2),
    paddingVertical: theme.sizing(1.5),
    height: theme.sizing(7),
  },
});

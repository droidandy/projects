import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerHuge: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    flex: 0,
    flexShrink: 1,
    marginLeft: theme.sizing(1),
  },
  labelHuge: {
    marginTop: theme.sizing(2),
    color: theme.green,
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSmall: {
    color: theme.green,
    fontSize: 14,
  },
  textMedium: {
    color: theme.green,
    fontSize: 16,
  },
  textLarge: {
    color: theme.green,
    fontSize: 18,
  },
  textHuge: {
    color: theme.green,
    fontSize: 24,
  },
});

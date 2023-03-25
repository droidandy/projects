import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: theme.screenPadding.horizontal - theme.sizing(0.5),
  },
});

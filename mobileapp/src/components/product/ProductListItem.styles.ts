import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  buttons: {
    flexShrink: 0,
    marginTop: theme.sizing(1.5),
  },
  button: {
    alignSelf: 'flex-end',
    width: 160,
  },
  buttonGift: {
    alignSelf: 'flex-end',
    width: 48,
  },
});

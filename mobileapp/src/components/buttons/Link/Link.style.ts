import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const linkStyles = StyleSheet.create({
  text: {
    fontFamily: theme.fonts.light,
    fontSize: 16,
    color: theme.green,
    textAlign: 'center',
  },
  view: { alignSelf: 'center', alignItems: 'center' },
  items: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

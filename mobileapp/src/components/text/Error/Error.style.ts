import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const errorStyle = StyleSheet.create({
  text: {
    textAlign: 'center',
    justifyContent: 'space-around',
    color: theme.error,
    fontSize: 14,
  },
});

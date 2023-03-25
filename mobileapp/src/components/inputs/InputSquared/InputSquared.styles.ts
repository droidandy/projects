import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: theme.sizing(4),
    padding: theme.sizing(0.5),
    backgroundColor: theme.lightenGray,
    borderRadius: 10,
  },
  input: {
    flexShrink: 1,
    width: '100%',
    height: theme.sizing(3),
    borderWidth: 0,
    fontFamily: theme.fonts.light,
    fontSize: 16,
    color: theme.black,
  },
});

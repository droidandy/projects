import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  formItemOpened: {
    marginBottom: 0,
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.sizing(2) - 2,
    paddingHorizontal: theme.sizing(2),
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 24,
    height: theme.sizing(6),
  },
  inputText: {
    fontFamily: theme.fonts.light,
    color: theme.green,
    fontSize: 16,
  },
});

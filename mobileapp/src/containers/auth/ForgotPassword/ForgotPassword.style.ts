import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    flexShrink: 0,
    alignItems: 'center',
  },
  dataChecker: {
    flex: 1,
    marginVertical: theme.sizing(4),
  },
  dataCheckerEmpty: {
    flex: 1,
  },
  remindButton: {
    marginTop: theme.sizing(1),
  },
  input: {
    width: '100%',
    maxWidth: 300,
  },
  inputItemStyle: {
    alignSelf: 'center',
  },
});

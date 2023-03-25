import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.sizing(3),
    paddingBottom: theme.screenPadding.vertical,
    flex: 1,
  },
  registerButton: {
    marginTop: theme.sizing(1),
  },
  loginButton: {
    marginTop: theme.sizing(1),
  },
  dataChecker: {
    flex: 1,
    marginVertical: theme.sizing(4),
  },
  dataCheckerEmpty: {
    flex: 1,
  },
  error: {
    marginTop: theme.sizing(2),
    flex: 1,
    height: theme.sizing(2),
    marginHorizontal: theme.screenPadding.horizontal,
  },
  input: {
    width: '100%',
    maxWidth: 300,
  },
  inputItemStyle: {
    alignSelf: 'center',
  },
});

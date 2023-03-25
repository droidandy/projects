import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  spaceTop: {
    flex: 1,
    maxHeight: theme.logoMarginTop,
  },
  logo: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: theme.sizing(6),
    marginBottom: theme.sizing(2),
  },
  content: {
    flex: 8,
    justifyContent: 'center',
  },
  kav: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  safeAreaView: {
    flex: 1,
    marginHorizontal: theme.screenPadding.horizontal,
    marginBottom: theme.screenPadding.vertical,
  },
  safeAreaViewNoPadding: {
    flex: 1,
    marginBottom: theme.screenPadding.vertical,
  },
});

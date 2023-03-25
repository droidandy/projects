import { PixelRatio, StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const inactiveTabGradientColors = ['#fff', theme.border];
const borderWidth = 2 / PixelRatio.get();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  tabs: {
    flexShrink: 0,
    width: '100%',
    height: theme.sizing(7),
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    height: theme.sizing(7),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: theme.lightGray,
    borderBottomWidth: borderWidth,
  },
  tabButtonLabel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabAdornment: {
    height: theme.sizing(1),
    width: '100%',
  },
  tabAdornmentActive: {
    height: theme.sizing(1),
    width: '100%',
    backgroundColor: theme.green,
  },
  separator: {
    height: theme.sizing(7),
    flexShrink: 0,
    width: borderWidth,
    backgroundColor: theme.lightGray,
  },
});

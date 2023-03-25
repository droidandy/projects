import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    backgroundColor: theme.red,
    height: theme.sizing(2.5),
    minWidth: theme.sizing(2.5),
    borderRadius: theme.sizing(2),
    borderWidth: theme.sizing(0.25),
    borderStyle: 'solid',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.sizing(0.25),
  },
  leftBadge: {
    top: theme.sizing(2),
    left: theme.sizing(-1),
  },
  rightBadge: {
    top: theme.sizing(2),
    right: theme.sizing(-1),
  },
  badgeText: {
    color: '#fff',
    fontFamily: theme.fonts.light,
    fontSize: 12,
    textAlign: 'center',
  },
});

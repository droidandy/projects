import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const menuItemStyles = StyleSheet.create({
  container: {
    paddingVertical: theme.sizing(1.5),
  },
  text: {
    paddingHorizontal: theme.sizing(1.5),
    color: theme.grayText,
  },
  line: {
    height: 1,
    backgroundColor: theme.lightGray,
  },
});

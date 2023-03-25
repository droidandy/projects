import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  topSpace: {
    flex: 1,
  },
  content: {
    flex: 4,
    marginTop: theme.sizing(4),
  },
  title: {
    paddingTop: theme.sizing(2),
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.fonts.light,
    fontWeight: 'bold',
    width: 252,
    flex: 0,
  },
  description: {
    paddingTop: theme.sizing(2),
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theme.fonts.light,
    width: 252,
    flex: 0,
  },
  carouselPagination: {
    marginTop: theme.sizing(3),
    color: theme.grayedGreen,
    textAlign: 'center',
  },
  carouselContainerCustom: {
    flexGrow: 0,
    padding: 0,
  },
  link: {
    marginTop: 32,
    padding: 8,
  },
});

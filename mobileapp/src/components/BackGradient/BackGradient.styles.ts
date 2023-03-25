import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  top: {
    flex: 3,
  },
  middle: {
    flex: 11,
    backgroundColor: theme.gradientLightColor,
  },
  bottom: {
    flex: 6,
  },
});

export const topColors = [theme.gradientDarkColor, theme.gradientLightColor];
export const bottomColors = [theme.gradientLightColor, theme.gradientDarkColor];

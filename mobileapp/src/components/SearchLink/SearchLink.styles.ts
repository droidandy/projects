import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  button: {
    height: theme.sizing(6),
    width: theme.sizing(7),
  },
  image: {
    marginVertical: theme.sizing(1.5),
    marginHorizontal: theme.sizing(2),
  },
});

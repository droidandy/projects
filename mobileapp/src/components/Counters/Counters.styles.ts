import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    width: 151,
    height: 37,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.border,
    paddingRight: theme.sizing(2),
    paddingLeft: theme.sizing(2),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  quantity: {
    width: theme.sizing(8),
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    textAlign: 'center',
    fontSize: 15,
  },
  touchable: {
    width: 14,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

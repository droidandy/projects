import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    marginVertical: theme.sizing(3),
  },
  bottomButton: {
    marginTop: theme.sizing(2),
  },
  photo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.sizing(4),
  },
  photoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: theme.sizing(34),
  },
  photoRemove: {
    width: theme.sizing(8),
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  fieldIcon: {
    flexShrink: 0,
    marginRight: theme.sizing(2),
    width: theme.sizing(3),
  },
  fieldInput: {
    flex: 1,
  },
  lastField: {
    marginBottom: 0,
  },
});

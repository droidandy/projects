import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: theme.sizing(3),
    marginBottom: theme.sizing(3),
  },
  photo: {
    flexShrink: 0,
    width: theme.sizing(10),
    height: theme.sizing(10),
    borderRadius: theme.sizing(5),
    overflow: 'hidden',
  },
  image: {
    width: theme.sizing(10),
    height: theme.sizing(10),
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginLeft: theme.sizing(2),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  fullName: {
    flex: 1,
    marginBottom: theme.sizing(1),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  fullNameText: {
    fontSize: 18,
    fontFamily: theme.fonts.productHeading,
    fontWeight: '800',
  },
  secondThirdName: {
    flex: 1,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icon: {
    flexShrink: 0,
    width: theme.sizing(2),
    height: theme.sizing(2),
    marginRight: theme.sizing(0.5),
  },
  linkText: {
    fontSize: 16,
    color: theme.grayText,
  },
});

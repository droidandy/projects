import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  button: {
    // height: theme.sizing(6),
    // width: Dimensions.get('window').width / 6,
    // margin: -24,
    // padding: 24,
  },
  image: {
    // marginVertical: theme.sizing(1.5),
    // marginHorizontal: theme.sizing(2),
  },
  badge: {
    position: 'absolute',
    marginTop: theme.sizing(1.75),
    marginLeft: theme.sizing(1.25),
    backgroundColor: theme.green,
    height: theme.sizing(2.5),
    minWidth: theme.sizing(2.5),
    borderRadius: theme.sizing(2),
    borderWidth: theme.sizing(0.25),
    borderStyle: 'solid',
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // paddingHorizontal: theme.sizing(0.25),
  },
  badgeText: {
    color: '#fff',
    fontFamily: theme.fonts.light,
    fontSize: 12,
    textAlign: 'center',
  },
});

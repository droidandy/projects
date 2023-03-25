import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16
  },
  labelContainer: {
    width: '100%',
    position: 'absolute',
    top: 94,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: theme.color.primaryText
  },
  label: {
    fontSize: 10,
    color: theme.color.primaryText
  }
});

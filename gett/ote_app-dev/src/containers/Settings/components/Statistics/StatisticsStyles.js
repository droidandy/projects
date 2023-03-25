import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  pageWrapper: {
    backgroundColor: theme.color.bgSecondary
  },
  wrapper: {
    paddingVertical: 20
  },
  blockTitle: {
    lineHeight: 30,
    color: theme.color.secondaryText,
    fontSize: 12,
    marginLeft: 16,
    marginBottom: 6
  },
  block: {
    width: '100%',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: theme.color.bgPrimary
  },
  loader: {
    marginTop: 40
  }
});

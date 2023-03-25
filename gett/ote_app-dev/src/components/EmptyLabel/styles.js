import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: theme.color.secondaryText,
    fontSize: 14,
    textAlign: 'center'
  },
  header: {
    marginBottom: 8,
    fontSize: 17
  },
  icon: {
    marginBottom: 24
  }
});

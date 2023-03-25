import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  timer: {
    fontWeight: 'bold',
    fontSize: 18,
    color: theme.color.primaryText
  },
  timerEnds: {
    color: theme.color.danger
  }
});

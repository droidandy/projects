import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flex: {
    flex: 1
  },
  input: {
    marginRight: 10
  },
  inputStyle: {
    fontSize: 18,
    color: theme.color.primaryText
  },
  header: {
    marginLeft: 15
  },
  phrase: {
    color: theme.color.primaryText,
    fontSize: 17,
    marginLeft: 15,
    paddingVertical: 11
  },
  phraseWrapper: {
    paddingVertical: 15
  }
});

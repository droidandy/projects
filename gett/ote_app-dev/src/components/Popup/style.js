import { StyleSheet } from 'react-native';

const styles = theme => StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  content: {
    alignSelf: 'stretch',
    backgroundColor: theme.color.bgPrimary,
    marginHorizontal: 12,
    padding: 20,
    minHeight: 50,
    borderRadius: 10
  },
  footer: {
    flexDirection: 'row',
    marginTop: 5
  },
  title: {
    marginBottom: 12,
    fontSize: 22,
    lineHeight: 30,
    color: theme.color.primaryText
  },
  description: {
    fontSize: 17,
    lineHeight: 20,
    color: theme.color.secondaryText
  },
  btn: {
    flex: 1,
    marginHorizontal: 5
  },
  popupInfo: {
    marginBottom: 10,
    textAlign: 'center'
  },
  titleStyle: {
    fontWeight: '600'
  },
  contentWrapperStyle: {
    alignItems: 'center'
  },
  doneIcon: {
    marginBottom: 10
  }
});

export default styles;

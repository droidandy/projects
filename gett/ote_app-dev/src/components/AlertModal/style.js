import { StyleSheet } from 'react-native';
import { color } from 'theme';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  titleStyle: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  contentStyle: {
    alignItems: 'center'
  },
  messageWrapper: {
    width: '100%',
    marginBottom: 20
  },
  messageStyle: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  btnCancelStyle: {
    backgroundColor: color.white
  },
  btnTextStyle: {
    color: color.secondaryText
  }
});

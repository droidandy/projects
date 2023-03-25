import { StyleSheet, PixelRatio } from 'react-native';

export default theme => StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginVertical: 0,
    marginRight: 0,
    padding: 0,
    borderBottomColor: theme.color.pixelLine,
    borderBottomWidth: PixelRatio.get() * StyleSheet.hairlineWidth
  }
});

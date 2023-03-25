import { StyleSheet } from 'react-native';
import { deviceHeight, deviceWidth } from 'utils';

export default StyleSheet.create({
  map: {
    zIndex: -1,
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    height: deviceHeight,
    width: deviceWidth
  }
});

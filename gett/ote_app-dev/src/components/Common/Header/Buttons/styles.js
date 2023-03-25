
import { StyleSheet } from 'react-native';
import { color } from 'theme';

export default theme => StyleSheet.create({
  headerBack: {
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: theme.color.bgPrimary,
    borderRadius: 6
  },
  touchZone: {
    paddingVertical: 6,
    paddingLeft: 3,
    paddingRight: 8
  },
  shadow: {
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  btnContainer: {
    padding: 3
  }
});

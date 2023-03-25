import { StyleSheet } from 'react-native';
import { color } from 'theme';

import { iPhoneHeaderPadding, isIphoneX, isAndroid } from 'utils';

const iOSPadding = isIphoneX() ? 180 : 190;

export default theme => StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
    paddingTop: iPhoneHeaderPadding
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 160,
    paddingVertical: 28,
    backgroundColor: theme.color.bgPrimary,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  buttonContainer: {
    padding: 5,
    marginHorizontal: 15
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16
  },
  pointerIcon: {
    marginRight: 6
  },
  textContainer: {
    paddingLeft: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputStyle: {
    color: theme.color.primaryText,
    paddingRight: 24,
    fontSize: 18
  },
  dividerStyle: {
    backgroundColor: theme.color.pixelLine,
    height: 1,
    marginLeft: 43,
    marginRight: 22,
    marginVertical: 16
  },
  pinContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingBottom: isAndroid ? 20 : iOSPadding,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

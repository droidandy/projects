import { StyleSheet } from 'react-native';
import { color } from 'theme';

import { isIphoneX, deviceWidth } from 'utils';

export default StyleSheet.create({
  container: {
    width: deviceWidth - 32,
    height: 66,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: color.primaryBtns,
    overflow: 'hidden',
    position: 'absolute',
    top: isIphoneX() ? 24 : 8,
    left: 16,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    height: 57,
    resizeMode: 'contain',
    position: 'absolute',
    top: 7,
    left: -120
  },
  logoPlaceholder: {
    width: 107,
    height: 57
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: color.white
  },
  icon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

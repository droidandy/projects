import { StyleSheet } from 'react-native';

import { color } from 'theme';
import { iPhoneHeaderPadding } from 'utils';

export default StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 99,
    position: 'absolute',
    left: 0,
    top: 0
  },
  messageWrapper: {
    paddingTop: iPhoneHeaderPadding,
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: color.danger,
    overflow: 'hidden'
  },
  message: {
    fontSize: 12,
    color: color.white
  }
});

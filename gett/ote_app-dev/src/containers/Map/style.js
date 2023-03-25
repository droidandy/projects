import { StyleSheet } from 'react-native';

import { iPhoneHeaderPadding } from 'utils';

export default theme => StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.color.bgSecondary,
    height: '100%',
    width: '100%',
    paddingTop: iPhoneHeaderPadding,
    justifyContent: 'space-between'
  }
});

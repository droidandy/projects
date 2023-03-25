import { StyleSheet } from 'react-native';

import { isIphoneX } from 'utils';

const styles = theme => StyleSheet.create({
  wrapper: {
    paddingBottom: 20
  },
  commonContainer: {
    paddingHorizontal: 15,
    marginLeft: 7,
    paddingTop: 5,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55
  },
  checkboxWrapper: {
    marginHorizontal: 12
  },
  lineView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  label: {
    color: theme.color.primaryText,
    fontSize: 17,
    flex: 1,
    marginHorizontal: 3
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 12
  },
  themeInfoWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: isIphoneX ? 24 : 16
  },
  themeInfoTitle: {
    color: theme.color.primaryText,
    fontSize: 22
  },
  themeInfoText: {
    color: theme.color.secondaryText,
    fontSize: 17.5,
    paddingTop: 16
  }
});

export default styles;

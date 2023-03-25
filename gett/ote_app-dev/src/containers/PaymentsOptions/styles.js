import { StyleSheet } from 'react-native';

import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  container: {
    marginBottom: isIphoneX ? 24 : 16
  },
  listView: {
    paddingHorizontal: 0,
    paddingTop: 0
  },
  icon: {
    marginRight: 7
  },
  flex: {
    flex: 1
  },
  commonContainer: {
    marginLeft: 15
  },
  paymentWrapper: {
    paddingTop: 5,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkboxWrapper: {
    marginHorizontal: 12
  },
  paymentView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentText: {
    color: theme.color.primaryText,
    fontSize: 17,
    marginHorizontal: 3
  }
});

import { StyleSheet } from 'react-native';
import { color } from 'theme';

import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  bg: {
    backgroundColor: theme.color.bgSecondary
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12
  },
  orders: {
    paddingHorizontal: 10,
    paddingTop: 20,
    marginBottom: isIphoneX() ? 20 : 0
  },
  orderWrapper: {
    marginBottom: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: theme.color.bgPrimary,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: theme.isNightMode ? 0.4 : 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  orderDetails: {
    paddingTop: 20,
    paddingBottom: 8
  },
  orderDate: {
    flex: 1,
    color: theme.color.secondaryText,
    fontSize: 12
  },
  orderMap: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden'
  },
  orderLabel: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    height: 23,
    marginLeft: 8,
    justifyContent: 'center'
  },
  orderLabelInfo: {
    backgroundColor: theme.color.infoLight
  },
  orderLabelDanger: {
    backgroundColor: theme.color.dangerLight
  },
  orderLabelSuccess: {
    backgroundColor: theme.color.successLight
  },
  orderLabelText: {
    fontWeight: '900',
    fontSize: 10
  },
  orderLabelTextInfo: {
    color: theme.color.info
  },
  orderLabelTextDanger: {
    color: theme.color.danger
  },
  orderLabelTextSuccess: {
    color: theme.color.success
  },
  orderAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 20
  },
  orderAddressIcon: {
    alignItems: 'center',
    marginRight: 14
  },
  orderStopAddressIcon: {
    marginLeft: 2,
    marginRight: 17
  },
  orderAddressGap: {
    marginBottom: 12
  },
  orderAddressText: {
    flex: 1,
    color: theme.color.primaryText
  },
  connector: {
    position: 'absolute',
    top: 15,
    left: -3
  },
  pickUpConnector: {
    top: 18
  },
  emptyLabel: {
    color: theme.color.secondaryText,
    fontSize: 22
  },
  recurringIcon: {
    padding: 3,
    backgroundColor: theme.color.infoLight,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
  spinner: {
    marginBottom: 10
  }
});

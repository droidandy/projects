import { StyleSheet } from 'react-native';
import { color } from 'theme';

import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  modalContent: {
    width: '100%',
    backgroundColor: theme.color.bgPrimary
  },
  flex: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pointerIcon: {
    marginHorizontal: 16
  },
  pointerIconRight: {
    marginRight: 16,
    marginLeft: 12
  },
  inputStyle: {
    fontSize: 15
  },
  inputWrapper: {
    borderBottomColor: theme.color.pixelLine,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  list: {
    flexGrow: 1
  },
  listView: {
    paddingHorizontal: 0,
    paddingTop: 0
  },
  itemAddressView: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    width: '100%'
  },
  itemAddressText: {
    fontSize: 15,
    color: theme.color.primaryText
  },
  itemAddressSubText: {
    paddingTop: 7,
    fontSize: 12,
    color: theme.color.secondaryText
  },
  indicatorView: {
    paddingVertical: 20
  },
  clearIcon: {
    marginTop: 8,
    marginHorizontal: 6
  },
  tabBarContent: {
    marginBottom: 20,
    marginTop: 25,
    flexGrow: 0
  },
  tabContainer: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 40,
    borderBottomWidth: 2,
    borderBottomColor: theme.color.bgSecondary
  },
  activeTab: {
    borderBottomColor: theme.color.primaryText
  },
  tabLabel: {
    fontSize: 12,
    color: theme.color.secondaryText
  },
  activeTabLabel: {
    color: theme.color.primaryText
  },
  loading: {
    textAlign: 'center',
    marginTop: 24,
    color: color.secondaryText
  },
  iconSpace: { marginRight: 16 },
  emptyLabel: {
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
    color: theme.color.primaryText
  },
  pickupBtn: {
    height: 26,
    width: 20,
    backgroundColor: 'yellow'
  },
  searchInputContainer: {
    paddingLeft: 4
  },
  addButton: {
    height: 50,
    marginHorizontal: 16,
    marginTop: 50,
    marginBottom: isIphoneX() ? 20 : 8
  }
});

import { StyleSheet, StatusBar, Platform } from 'react-native';
import { isIphoneX, isAndroid } from 'utils';

const iPhoneSpace = isIphoneX() ? 40 : 20;
const topSpace = (Platform.OS === 'ios' ? iPhoneSpace : StatusBar.currentHeight) + 5;

export default theme => StyleSheet.create({
  flex: {
    flex: 1,
    zIndex: 100
  },
  headerContainer: {
    width: '100%',
    zIndex: -1
  },
  header: {
    paddingRight: 4
  },
  content: {
    marginTop: Platform.OS === 'ios' ? -61 : -64,
    zIndex: 1000
  },
  tabsWrapper: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    backgroundColor: theme.color.bgPrimary
  },
  tab: {
    flex: 1,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: theme.isNightMode ? theme.color.pixelLine : 'transparent',
    justifyContent: 'center'
  },
  activeTab: {
    borderBottomColor: theme.color.primaryText
  },
  tabLabel: {
    color: theme.color.secondaryText,
    fontSize: 12,
    textAlign: 'center'
  },
  activeTabLabel: {
    color: theme.color.primaryText
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  searchBarInput: {
    minHeight: 32,
    margin: 0,
    marginHorizontal: 7,
    paddingLeft: 30,
    backgroundColor: theme.formattedColor.primaryText.opacity(0.1),
    color: theme.color.primaryText,
    fontSize: 15
  },
  searchBarIcon: {
    left: 15
  },
  iconLeftBtn: {
    paddingLeft: 5
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  iconRightBtn: {
    paddingRight: 7
  },
  activeCalendarFilter: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.color.secondaryText
  },
  search: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99,
    marginTop: topSpace + 6,
    paddingLeft: 4,
    paddingRight: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  leftPlaceholder: {
    height: isAndroid ? 33.5 : 30.5
  }
});

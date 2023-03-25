import { StyleSheet } from 'react-native';
import { color } from 'theme';

export default theme => StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: 118,
    height: 139,
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadow: {
    position: 'absolute',
    top: 10,
    left: 10
  },
  shadowActive: {
    backgroundColor: theme.color.bgPrimary,
    width: 98,
    height: 119,
    borderRadius: 10,
    elevation: theme.isNightMode ? 4 : 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  container: {
    backgroundColor: theme.color.bgPrimary,
    zIndex: 0,
    width: 98,
    height: 119,
    borderRadius: 10,
    paddingTop: 11,
    paddingBottom: 9
  },
  layout: {
    position: 'absolute',
    opacity: 0.4,
    left: 0,
    bottom: 0
  },
  column: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  activeContainer: {
    shadowRadius: 0
  },
  activeBackground: {
    width: 118,
    height: 139
  },
  activeBackgroundHidden: {
    opacity: 0
  },
  label: {
    paddingLeft: 2,
    fontSize: 14,
    color: theme.color.secondaryText,
    marginVertical: 2
  },
  labelPrice: {
    paddingLeft: 2,
    fontSize: 17,
    color: theme.color.primaryText,
    fontWeight: 'bold',
    marginVertical: 2
  },
  top: {
    paddingHorizontal: 8,
    paddingTop: 4
  },
  image: {
    alignSelf: 'center'
  },
  badge: {
    position: 'absolute',
    top: 1,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: theme.isNightMode ? 4 : 2,
    backgroundColor: theme.isNightMode ? theme.color.bgSecondary : theme.color.arrowRight,
    flexDirection: 'row',
    paddingHorizontal: 11,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.bgPrimary
  },
  badgeActive: {
    backgroundColor: theme.color.primaryBtns
  },
  badgeText: {
    color: theme.formattedColor.white.opacity(theme.isNightMode ? 0.6 : 1),
    fontSize: 12,
    lineHeight: 14
  },
  badgeTextActive: {
    color: theme.color.primaryText
  },
  badgeValue: {
    fontWeight: 'bold'
  },
  price: {
    display: 'flex',
    flexDirection: 'row'
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinner: {
    height: 32,
    width: 32
  }
});

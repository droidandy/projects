import { StyleSheet } from 'react-native';
import { color } from 'theme';
import { iPhoneHeaderPadding, deviceHeight } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  flightTracking: {
    backgroundColor: theme.color.bgPrimary
  },
  container: {
    borderBottomColor: theme.color.bgSecondary,
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 107,
    paddingLeft: 16,
    width: '100%'
  },
  label: {
    color: theme.color.secondaryText,
    fontSize: 12,
    paddingTop: 18
  },
  primaryText: {
    color: theme.color.primaryText,
    fontSize: 22,
    paddingVertical: 8
  },
  time: {
    color: theme.color.secondaryText,
    fontSize: 14
  },
  departureIcon: {
    marginRight: 6,
    transform: [{ rotate: '-45deg' }]
  },
  arrivalIcon: {
    marginRight: 6,
    transform: [{ rotate: '45deg' }]
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  searchIcon: {
    alignItems: 'center',
    marginRight: 5,
    marginTop: 10
  },
  input: {
    fontSize: 17
  },
  clearIcon: {
    marginRight: 12
  },
  inputContainerStyle: {
    paddingTop: 8
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 0,
    justifyContent: 'center'
  },
  dotsIcon: {
    marginRight: 15
  },
  chevronIcon: {
    paddingHorizontal: 20
  },
  flightTrackingSchedule: {
    backgroundColor: color.primaryText
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  tab: {
    height: 2,
    opacity: 0.1,
    backgroundColor: color.bgPrimary
  },
  activeTab: {
    opacity: 1
  },
  tabLabel: {
    color: color.bgPrimary,
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 10
  },
  activeTabLabel: {
    opacity: 1
  },
  primaryContainer: {
    paddingBottom: 30
  },
  roundedContainer: {
    backgroundColor: theme.color.bgPrimary,
    borderRadius: 10,
    flex: 1,
    display: 'flex',
    marginHorizontal: 16,
    marginVertical: 5
  },
  scrollView: {
    flexGrow: 0,
    backgroundColor: theme.color.flightHeader
  },
  header: {
    backgroundColor: theme.color.flightContainer,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 4
  },
  headerText: {
    color: theme.color.secondaryText,
    fontSize: 12,
    lineHeight: 28
  },
  main: {
    borderBottomColor: theme.color.bgSecondary,
    borderBottomWidth: 1,
    paddingLeft: 15,
    paddingBottom: 17,
    paddingTop: 20
  },
  primaryTextSchedule: {
    color: theme.color.primaryText,
    fontSize: 22,
    paddingBottom: 8,
    paddingTop: 1
  },
  text: {
    color: theme.color.secondaryText,
    fontSize: 12
  },
  textValue: {
    color: theme.color.primaryText,
    fontSize: 12,
    paddingLeft: 7
  },
  secondary: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingVertical: 10
  },
  secondaryTime: {
    color: theme.color.primaryText,
    fontSize: 14,
    paddingTop: 5
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    height: deviceHeight - iPhoneHeaderPadding - 100
  },
  gradientContainer: {
    position: 'absolute',
    top: 225
  },
  gradientSize: {
    height: 70,
    width: '100%'
  },
  gap: {
    height: 245
  },
  absoluteScroll: {
    bottom: 0,
    position: 'absolute',
    top: 35,
    width: '100%'
  },
  errorMessage: {
    color: color.danger,
    marginHorizontal: 15,
    paddingTop: 4
  }
});

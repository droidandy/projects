import { StyleSheet } from 'react-native';
import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  pickupTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 50,
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: theme.color.bgPrimary
  },
  pickupTime: {
    marginLeft: 17,
    flex: 1
  },
  pickupTimeLabel: {
    fontSize: 14,
    color: theme.color.secondaryText,
    marginBottom: 2
  },
  pickupTimeValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.color.primaryText
  },
  selectedWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6
  },
  time: {
    fontSize: 36,
    color: theme.color.primaryText,
    fontWeight: 'bold',
    marginBottom: 5,
    marginRight: 6
  },
  timezone: {
    fontSize: 10,
    lineHeight: 12,
    color: theme.color.secondaryText
  },
  timezoneTitle: {
    fontSize: 12,
    color: theme.color.primaryText
  },
  date: {
    color: theme.color.primaryText,
    fontSize: 18
  },
  TDPickerWrapper: {
    borderColor: theme.color.pixelLine,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: theme.isNightMode ? theme.color.pixelLine : theme.color.bgPrimary
  },
  disabledButton: {
    backgroundColor: theme.color.bgSecondary
  },
  nowButton: {
    marginRight: 10
  },
  primaryBtn: {
    marginVertical: 8,
    marginHorizontal: 16
  },
  TDEditIcon: {
    marginBottom: -5
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tabBarContainer: {
    flexDirection: 'row'
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  recurrenceFactorInput: {
    marginRight: 16
  },
  recurringTitle: {
    fontSize: 22,
    color: theme.color.primaryText,
    paddingVertical: 30
  },
  content: {
    marginHorizontal: 16,
    paddingVertical: 8
  },
  inputLabel: {
    fontSize: 17,
    color: theme.color.primaryText
  },
  recurringOptionIcon: {
    marginRight: 16
  },
  recurringValueContainer: {
    paddingRight: 12,
    justifyContent: 'center',
    height: 45
  },
  recurringOptionTitle: {
    color: theme.color.secondaryText
  },
  recurringOptionValue: {
    fontSize: 17,
    color: theme.color.primaryText,
    fontWeight: 'bold'
  },
  recurringOptionContainer: {
    paddingVertical: 12
  },
  workdays: {
    marginBottom: 16
  },
  calendar: {
    marginBottom: 20
  },
  periodModalHeader: {
    flex: 1,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 0
  },
  periodModalHeaderTitle: {
    color: theme.color.primaryText,
    fontSize: 18
  },
  periodModalClear: {
    width: 60,
    fontSize: 17,
    color: theme.color.primaryText,
    textAlign: 'right'
  },
  recurringIcon: {
    padding: 3,
    backgroundColor: theme.color.infoLight,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chevronIcon: {
    marginLeft: 10
  },
  controlsWrapper: {
    paddingBottom: isIphoneX() ? 16 : 0,
    backgroundColor: theme.color.bgPrimary
  },
  shadowWrapper: {
    elevation: 2,
    shadowColor: theme.color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  modal: {
    backgroundColor: theme.color.bgPrimary
  },
  backPeriodBtn: {
    width: 75
  }
});

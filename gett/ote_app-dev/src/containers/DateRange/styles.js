import { StyleSheet } from 'react-native';
import { color } from 'theme';
import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: theme.color.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonView: {
    position: 'absolute',
    backgroundColor: theme.color.bgPrimary,
    width: '100%',
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: isIphoneX() ? 24 : 8,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  interval: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 16,
    paddingTop: 26
  },
  intervalText: {
    textAlign: 'center',
    color: theme.color.primaryText,
    fontSize: 22
  },
  startDate: {
    textAlign: 'left'
  },
  endDate: {
    textAlign: 'right'
  },
  intervalTextDisabled: {
    color: theme.color.secondaryText
  },
  calendar: {
    marginTop: 60
  },
  calendarList: {
    backgroundColor: theme.color.bgPrimary
  }
});

import { StyleSheet } from 'react-native';
import { iPhoneHeaderPadding } from 'utils';
import { color } from 'theme';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    width: '100%',
    zIndex: -1
  },
  header: {
    backgroundColor: theme.color.flightHeader,
    paddingTop: iPhoneHeaderPadding + 6,
    paddingLeft: 4,
    paddingRight: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative'
  },
  headerFlightTextPrimary: {
    textAlign: 'center',
    fontSize: 18,
    color: color.white
  },
  headerFlightTextSecondary: {
    textAlign: 'center',
    color: color.white,
    opacity: 0.6
  },
  backBtnContainer: {
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    top: iPhoneHeaderPadding + 6,
    zIndex: 1
  },
  backBtn: {
    marginLeft: 20
  }
});

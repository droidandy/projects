import { StyleSheet } from 'react-native';
import { color } from 'theme';
import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  labelStyle: {
    marginVertical: 6
  },
  pickUpTimeWrapper: {
    marginBottom: 30,
    paddingHorizontal: 16
  },
  contentBlock: {
    backgroundColor: theme.color.bgPrimary,
    paddingVertical: 8
  },

  mainInfoContainer: {
    marginBottom: 30
  },

  detailsContainer: {
    marginBottom: 20
  },

  spacer: {
    height: 20
  },
  orderRideBtn: {
    padding: 5
  },
  orderRideBtnWrapper: {
    width: '100%',
    backgroundColor: theme.color.bgPrimary,
    paddingVertical: 3,
    paddingHorizontal: 11,
    paddingBottom: isIphoneX() ? 23 : 3,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  scrollView: {
    backgroundColor: theme.color.bgSecondary
  }
});

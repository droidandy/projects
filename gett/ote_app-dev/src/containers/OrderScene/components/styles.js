import { StyleSheet } from 'react-native';

import { color } from 'theme';

import { isIphoneX, isIOS, deviceHeight, deviceWidth } from 'utils';

export const fbStyles = theme => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  elevationButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.color.bgPrimary,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.color.bgPrimary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginTop: 8
  }
});

export const orderPanelStyles = theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  pickUpTimeWrapper: {
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  noVehicles: {
    marginHorizontal: 3
  },
  activeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  activeContainerBorder: {
    borderRadius: 10
  },
  listItem: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: theme.color.bgPrimary,
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 16
  },
  listItemReference: {
    backgroundColor: theme.color.bgPrimary,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  activeItem: {
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  row: {
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  headerStatus: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  headerNoInfoWrapper: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerNoInfoText: {
    fontSize: 17,
    lineHeight: 23,
    color: 'white'
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 12,
    color: color.white
  },
  subHeader: {
    flexDirection: 'row'
  },
  subHeaderTitle: {
    color: color.white
  },
  serviceId: {
    color: color.white,
    fontWeight: '900',
    paddingLeft: 5,
    flex: 1
  },
  driverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginTop: 4
  },
  fleetContainer: {
    flexDirection: 'row',
    height: 40
  },
  roundContainer: {
    width: 44,
    height: 44,
    borderRadius: 22
  },
  driverCarInfo: {
    color: color.secondaryText,
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 17
  },
  driverLicense: {
    color: theme.color.primaryText,
    fontSize: 17,
    fontWeight: '900'
  },
  callButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.success
  },
  callDispatcherText: {
    fontWeight: 'bold',
    color: theme.color.primaryText,
    fontSize: 18,
    marginLeft: 10,
    flex: 1
  },
  rateButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primaryBtns
  },
  title: {
    color: color.secondaryText,
    marginBottom: 4
  },
  name: {
    color: theme.color.primaryText,
    fontSize: 18,
    fontWeight: '900'
  },
  priceLabel: {
    textAlign: 'right'
  },
  pointList: {
    marginHorizontal: 0,
    marginVertical: 6
  },
  journeyDetails: {
    shadowRadius: 0,
    shadowColor: 'transparent',
    marginVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 12
  },
  divider: {
    marginLeft: -16,
    marginRight: -16,
    marginVertical: 8
  },
  listOption: {
    alignSelf: 'stretch',
    marginVertical: 4
  },
  listOptionReferenceHeader: {
    width: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginVertical: 0,
    backgroundColor: theme.isNightMode ? theme.formattedColor.bgPrimary.opacity(0.6) : theme.color.bgSecondary
  },
  referenceTitle: {
    fontSize: 12,
    color: color.secondaryText
  },
  carImage: { width: 90, height: 38 },
  copyAlertWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: deviceHeight,
    zIndex: 999,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyAlert: {
    backgroundColor: color.backdrop,
    height: 120,
    width: 120,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  copyAlertIcon: {
    marginTop: 5,
    marginBottom: 15
  },
  copyAlertText: {
    color: theme.color.white,
    fontSize: 17
  },
  actionsBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.formattedColor.white.opacity(0.6)
  }
});

const circleSize = deviceWidth * 0.6;

export const pointerStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: deviceHeight - (isIOS && (isIphoneX() ? 10 : 20)),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    height: circleSize,
    width: circleSize,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    position: 'absolute'
  }
});

export const cancelReasonStyles = theme => StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0
  },
  container: {
    backgroundColor: color.primaryText,
    flex: 1,
    paddingTop: isIphoneX() ? 40 : 30,
    paddingHorizontal: 15
  },
  closeIcon: {
    alignSelf: 'flex-end'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 16
  },
  header: {
    fontSize: 30,
    color: color.white,
    marginBottom: 10,
    textAlign: 'center'
  },
  subHeader: {
    fontSize: 14,
    color: color.white,
    textAlign: 'center'
  },
  title: {
    marginTop: 40,
    marginBottom: 25,
    fontSize: 22,
    color: color.white,
    textAlign: 'center'
  },
  list: {
    alignSelf: 'stretch',
    paddingBottom: 10
  },
  reason: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.color.bgPrimary,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 17
  },
  reasonTitle: {
    fontSize: 17,
    color: theme.color.primaryText,
    fontWeight: 'bold',
    marginLeft: 15
  }
});

import { StyleSheet } from 'react-native';

import { color } from 'theme';

import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    flex: 1
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  nextStepBtn: {
    alignSelf: 'stretch',
    flex: 1,
    padding: 5,
    marginHorizontal: 15
  },
  floatedPointList: {
    backgroundColor: theme.color.bgPrimary,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    },
    marginHorizontal: 20,
    marginVertical: 5,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    borderRadius: 10
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  footerOrder: {
    paddingBottom: isIphoneX() ? 25 : 10
  },
  selectAddress: {
    elevation: 2,
    backgroundColor: theme.color.bgPrimary,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  btnView: {
    width: 50,
    height: 50,
    paddingHorizontal: 15,
    margin: 2,
    backgroundColor: theme.color.bgPrimary
  },
  padding: {
    padding: 5
  },
  btnWrapper: {
    paddingTop: 10,
    marginBottom: 15,
    overflow: 'hidden'
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 9
  },
  leftActionsBar: {
    marginLeft: 15
  },
  futureOrderBtn: {
    marginRight: 15
  },
  destinationBtnsContainer: {
    minHeight: 80,
    marginBottom: isIphoneX() ? 15 : 0,
    justifyContent: 'center'
  },
  destinationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  destinationBtnsSpinner: {
    alignSelf: 'center'
  },
  customDestinationText: {
    color: theme.color.primaryText,
    fontWeight: 'bold',
    fontSize: 16
  },
  flex: {
    flex: 1
  },
  pickUpTimeWrapper: {
    marginHorizontal: 20,
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
  pickUpMarkerContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingBottom: isIphoneX() ? 170 : 190,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noVehiclesMessage: {
    height: 185,
    justifyContent: 'center',
    marginBottom: 5,
    marginHorizontal: 20,
    marginTop: 15
  },
  addButton: {
    flex: 1,
    height: 50,
    marginBottom: 8,
    marginHorizontal: 16
  }
});

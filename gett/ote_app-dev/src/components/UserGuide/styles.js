import { StyleSheet, StatusBar } from 'react-native';
import { color } from 'theme';
import { isAndroid } from 'utils';

export default StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100
  },
  flex: {
    flex: 1
  },
  backdrop: {
    backgroundColor: color.backdrop,
    zIndex: 0,
    overflow: 'visible'
  },
  row: {
    flexDirection: 'row',
    zIndex: 1,
    overflow: 'visible'
  },
  holeWrapper: {
    zIndex: 1,
    overflow: 'hidden',
    bottom: 0
  },
  hole: {
    backgroundColor: 'transparent',
    borderWidth: 10,
    borderRadius: 20,
    borderColor: color.backdrop,
    overflow: 'hidden'
  },
  actionsPanel: {
    position: 'absolute',
    bottom: 0,
    zIndex: 2,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btn: {
    padding: 20
  },
  btnText: {
    color: color.white,
    fontSize: 18
  },
  pointer: {
    marginBottom: 10
  },
  pointerRow: {
    marginBottom: 0,
    marginRight: 10
  },
  centerItems: {
    alignItems: 'center'
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hintText: {
    fontSize: 20,
    color: color.white
  },
  stepMap1: {
    zIndex: 1,
    position: 'absolute',
    bottom: 178 + (isAndroid && StatusBar.currentHeight),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 12
  },
  stepMap2: {
    position: 'absolute',
    top: 85 - (isAndroid && StatusBar.currentHeight),
    right: 35,
    alignItems: 'center',
    paddingTop: 20
  },
  stepMap3: {
    position: 'absolute',
    top: 45 - (isAndroid && StatusBar.currentHeight),
    left: 55,
    alignItems: 'center',
    zIndex: 1,
    paddingTop: 60
  },
  arrowMap1: {
    position: 'absolute',
    left: 25,
    bottom: 0
  },
  arrowMap2: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  arrowMap3: {
    position: 'absolute',
    left: 13,
    top: 0
  },
  stepOrders1: {
    position: 'absolute',
    top: 105 - (isAndroid && StatusBar.currentHeight),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 35
  },
  stepOrders2: {
    zIndex: 1,
    position: 'absolute',
    top: 215 - (isAndroid && (10 + StatusBar.currentHeight)),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 12
  },
  arrowOrders1: {
    position: 'absolute',
    left: 40,
    top: 25
  },
  arrowOrders2: {
    position: 'absolute',
    left: 40,
    bottom: 0
  },
  stepSettings1: {
    zIndex: 1,
    position: 'absolute',
    top: 138 - (isAndroid && StatusBar.currentHeight),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 12
  },
  stepSettings2: {
    position: 'absolute',
    top: 196 - (isAndroid && StatusBar.currentHeight),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 20
  },
  stepSettings3: {
    position: 'absolute',
    top: 206 - (isAndroid && StatusBar.currentHeight),
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 20
  },
  arrowSettings1: {
    position: 'absolute',
    left: 40,
    bottom: 0
  },
  arrowSettings2: {
    position: 'absolute',
    left: 40,
    bottom: 0
  },
  arrowSettings3: {
    position: 'absolute',
    left: 40,
    bottom: 0
  }
});

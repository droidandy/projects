import { Dimensions, Platform, StatusBar } from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';

const { width, height } = Dimensions.get('window');

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const deviceWidth = isIOS ? width : ExtraDimensions.get('REAL_WINDOW_WIDTH');
export const deviceHeight = isIOS ? height : ExtraDimensions.get('REAL_WINDOW_HEIGHT');

export function isIphoneX() {
  return isIOS && !Platform.isPad && !Platform.isTVOS && (height === 812 || width === 812);
}

export function getCurrentRoute({ dangerouslyGetParent }) {
  const parentRoute = dangerouslyGetParent().state;

  return parentRoute.routes[parentRoute.index];
}

export const headerPadding = isAndroid ? StatusBar.currentHeight + 5 : 25;
export const iPhoneHeaderPadding = isIphoneX() ? 45 : headerPadding;

export function didRestoreFromBackground(appState, nextAppState, followInactive = false) {
  const validation = followInactive ? /inactive|background/ : /background/;
  return appState.match(validation) && nextAppState === 'active';
}

export const touchableArea = { top: 8, right: 8, bottom: 8, left: 8 };

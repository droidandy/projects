import { createSwitchNavigator } from 'react-navigation';

import { AuthLoading } from 'containers';

import NavigatorLogin from './navigatorLogin';
import NavigatorApp from './navigatorApp';

const routeConfiguration = {
  NavigatorLogin: {
    screen: NavigatorLogin
  },
  App: {
    screen: NavigatorApp
  },
  AuthLoading: {
    screen: AuthLoading
  }
};

const NavigatorRoot = createSwitchNavigator(routeConfiguration, {
  gesturesEnabled: false,
  headerMode: 'none',
  initialRouteName: 'AuthLoading'
});

export default NavigatorRoot;

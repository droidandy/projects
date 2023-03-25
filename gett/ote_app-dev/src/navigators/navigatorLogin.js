import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { Login, ForgotPassword, Registration } from 'containers';
import { InfoPages } from 'containers/Settings';

import { BackBtn } from 'components';

import { strings } from 'locales';

const routeConfiguration = {
  Login: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  Registration: {
    screen: Registration,
    navigationOptions: {
      header: null
    }
  },
  InfoPages: {
    screen: InfoPages,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: navigation.state.params.theme.color.primaryText,
      headerStyle: {
        backgroundColor: navigation.state.params.theme.color.bgPrimary,
        paddingTop: Platform.OS === 'android' ? 20 : 0,
        height: Platform.OS === 'android' ? 80 : 50
      },
      headerLeft: <BackBtn navigation={navigation} testID={`${navigation.state.params.page}Back`} />,
      headerTitle: strings(`information.${navigation.state.params.page}`)
    })
  }
};

const stackNavigatorConfiguration = {
  gesturesEnabled: false,
  headerMode: 'screen'
};

const NavigatorLogin = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);

export default NavigatorLogin;

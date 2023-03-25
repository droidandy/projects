import React from 'react';
import { createStackNavigator, StackViewStyleInterpolator } from 'react-navigation-stack';

import 'components'; // TODO pls fix this magic
import {
  Map,
  Orders,
  RateDriver,
  TransitionLoading,
  Receipt,
  EditOrderDetails,
  EditOrderBackButton,
  DateRange,
  Notifications,
  PickupAddressScene
} from 'containers';
import { NotificationsBackBtn } from 'containers/Notifications';
import { HeaderSearch } from 'containers/Orders';
import { ReceiptHeader } from 'containers/Receipt';
import { strings } from 'locales';

import SettingsNavigator from './navigatorSettings';

import getDefaultHeaderStyle from './utils';

const routeConfiguration = {
  TransitionLoading: {
    screen: TransitionLoading,
    navigationOptions: { header: null }
  },
  MapView: {
    screen: Map,
    navigationOptions: { header: null }
  },
  PickupAddressScene: {
    screen: PickupAddressScene,
    navigationOptions: { header: null }
  },
  EditOrderDetails: {
    screen: EditOrderDetails,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: navigation.state.params.theme.color.primaryText,
      headerStyle: getDefaultHeaderStyle(navigation),
      headerTitle: strings('order.text.orderDetails'),
      headerLeft: <EditOrderBackButton
        navigation={navigation}
        backAction={navigation.state.params.restoreFutureOrder}
      />
    })
  },
  Settings: {
    screen: SettingsNavigator,
    navigationOptions: { header: null }
  },
  OrdersView: {
    screen: Orders,
    navigationOptions: ({ navigation }) => ({
      header: (
        <HeaderSearch navigation={navigation} />
      )
    })
  },
  DateRange: {
    screen: DateRange,
    navigationOptions: { header: null }
  },
  NotificationsView: {
    screen: Notifications,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: navigation.state.params.theme.color.primaryText,
      headerStyle: getDefaultHeaderStyle(navigation),
      headerTitle: 'Notification History',
      headerLeft: <NotificationsBackBtn navigation={navigation} />
    })
  },
  RateDriver: {
    screen: RateDriver,
    navigationOptions: { header: null }
  },
  Receipt: {
    screen: Receipt,
    navigationOptions: ({ navigation }) => ({
      header: <ReceiptHeader navigation={navigation} />
    })
  }
};

const loadTransition = (index, position) => {
  const inputRange = [index - 1, index, index + 1];
  const opacity = position.interpolate({ inputRange, outputRange: [0, 1, 1] });

  return { opacity };
};

const stackNavigatorConfiguration = {
  headerMode: 'screen',
  gesturesEnabled: false,
  initialRouteName: 'TransitionLoading',
  transitionConfig: () => ({
    screenInterpolator: (sceneProps) => {
      const { position, scene } = sceneProps;
      const { index, route } = scene;
      const params = route.params || {};
      const transition = params.transition || 'default';

      return {
        loadTransition: loadTransition(index, position),
        default: StackViewStyleInterpolator.forFadeFromBottomAndroid(sceneProps)
      }[transition];
    }
  })
};

const NavigatorApp = createStackNavigator(
  routeConfiguration,
  stackNavigatorConfiguration
);

export default NavigatorApp;

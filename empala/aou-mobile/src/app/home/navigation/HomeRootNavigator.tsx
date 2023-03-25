import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { HomeNavigator } from './HomeNavigator';
import { Routes } from './routes';
import { ModalStackParamList } from './types';

import { AccountSelector } from '~/components/accountSelector';
import { ModalScreen } from '~/components/modalScreen';

const RootStack = createStackNavigator<ModalStackParamList>();

export const RootNavigatorWithModal = (): JSX.Element => (
  <RootStack.Navigator
    screenOptions={{
      presentation: 'modal',
      cardStyle: { backgroundColor: 'transparent' },
      cardOverlayEnabled: false,
    }}
  >
    <RootStack.Screen
      name={Routes.Main}
      component={HomeNavigator}
      options={{ headerShown: false }}
    />

    <RootStack.Screen
      name={Routes.AccountSelector}
      component={AccountSelector}
      options={{ headerShown: false }}
    />

    <RootStack.Screen
      name={Routes.ModalScreen}
      component={ModalScreen}
      options={{ headerShown: false }}
    />

    <RootStack.Screen
      name={Routes.FullScreen}
      component={ModalScreen}
      options={{
        headerShown: false,
        presentation: 'card',
      }}
    />
  </RootStack.Navigator>
);

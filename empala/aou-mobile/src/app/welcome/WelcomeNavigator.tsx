import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { Welcome } from './Welcome';

const Stack = createStackNavigator();

export const WelcomeNavigator = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
  </Stack.Navigator>
);

import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { SignInParamList, SignInScreens } from './types';

import { SignIn, ForgotPassword, SetNewPassword } from '~/app/signin/screens';

const Stack = createStackNavigator<SignInParamList>();

export const SignInNavigator = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name={SignInScreens.SignIn} component={SignIn} />
    <Stack.Screen name={SignInScreens.ForgotPassword} component={ForgotPassword} />
    <Stack.Screen name={SignInScreens.SetNewPassword} component={SetNewPassword} />
  </Stack.Navigator>
);

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

import { Routes } from './routes';
import { ExploreParamList } from './types';

import { Explore } from '~/app/home/screens';
import { CompanyProfile } from '~/app/home/screens/explore/companyProfile';
import { IconWithNotification } from '~/components/atoms/icon';
import { theme } from '~/theme';

const ExploreStack = createNativeStackNavigator<ExploreParamList>();

export const ExploreNavigator = (): JSX.Element => (
  <ExploreStack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackVisible: true,
      headerLargeTitle: true,
      headerShadowVisible: false,
      headerStyle: { backgroundColor: theme.colors.Green200 },
    }}
  >
    <ExploreStack.Screen
      name={Routes.ExploreScreen}
      component={Explore}
      options={({ route }) => ({
        title: 'Explore',
        headerTitleStyle: { color: theme.colors.White },
        headerLargeTitleStyle: {
          fontFamily: 'Inter_800ExtraBold',
          fontSize: 28,
        },
      })}
    />

    <ExploreStack.Screen
      name={Routes.CompanyProfile}
      component={CompanyProfile}
      options={({ route }) => ({
        headerShown: true,
        title: '',
        headerRight: () => (
          <IconWithNotification count={route.params?.orderCount || 1} name="bell" style={s.headerRightStyle} />
        ),
      })}
    />
  </ExploreStack.Navigator>
);

const s = StyleSheet.create({
  headerRightStyle: {
    marginRight: 15,
  },
});

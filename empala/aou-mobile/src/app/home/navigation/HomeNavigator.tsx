import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import {
  Hunches,
  Stacks,
  MyStack,
  HunchScreen,
  OtherStack,
  Investopeers,
} from '../screens';

import { BottomTabNavigator } from './BottomTabNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { TradeNavigator } from './TradeNavigator';
import { Routes } from './routes';
import { RootStackParamList } from './types';

import { setAccountId } from '~/amplify/awsconfig';
import NotFoundScreen from '~/app/NotFoundScreen';
import { HunchCreationNavigator } from '~/app/home/navigation/CreateHunch';
import { StackCreationNavigator } from '~/app/home/navigation/CreateStack';
import { NewAccountNavigator } from '~/app/home/navigation/NewAccount';
import { CompaniesList, ExploreHunches, ExploreStacks } from '~/app/home/screens/explore/exploreScreen';
import { Documents } from '~/app/profile/screens';
import { BackButton } from '~/components/atoms/backIcon/BackIcon';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';
import { ScreenHeader } from '~/components/atoms/screenHeader';
import { theme } from '~/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HomeNavigator = ({ navigation }): JSX.Element => {
  React.useEffect(() => {
    setAccountId().then(() => { }).catch(() => { });
  });

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Routes.Root} component={BottomTabNavigator} />
      <Stack.Screen name={Routes.Hunches} component={Hunches} />
      <Stack.Screen name={Routes.Stacks} component={Stacks} />
      <Stack.Screen
        name={Routes.ExploreHunches}
        component={ExploreHunches}
        options={{
          title: 'Hunches™',
          headerShown: true,
          headerBackVisible: false,
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.Green200 },
          headerTitleStyle: { color: theme.colors.White },
          headerLargeTitleStyle: {
            fontFamily: 'Inter_800ExtraBold',
            fontSize: 28,
          },
          headerLeft: () => (
            <ButtonWithIcon
              icon="backArrow"
              color={theme.colors.White}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => null,
        }}
      />
      <Stack.Screen
        name={Routes.ExploreStacks}
        component={ExploreStacks}
        options={{
          title: 'Investacks™',
          headerShown: true,
          headerBackVisible: false,
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.Green200 },
          headerTitleStyle: { color: theme.colors.White },
          headerLargeTitleStyle: {
            fontFamily: 'Inter_800ExtraBold',
            fontSize: 28,
          },
          headerLeft: () => (
            <ButtonWithIcon
              icon="backArrow"
              color={theme.colors.White}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => null,
        }}
      />
      <Stack.Screen
        name={Routes.CompaniesList}
        component={CompaniesList}
        options={{
          title: 'Companies',
          headerShown: true,
          headerBackVisible: false,
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.Green200 },
          headerTitleStyle: { color: theme.colors.White },
          headerLargeTitleStyle: {
            fontFamily: 'Inter_800ExtraBold',
            fontSize: 28,
          },
          headerLeft: () => (
            <ButtonWithIcon
              icon="backArrow"
              color={theme.colors.White}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => null,
        }}
      />
      <Stack.Screen
        name={Routes.Investopeers}
        component={Investopeers}
        options={{
          title: 'Investopeers™',
          headerShown: true,
          headerTransparent: true,
          headerTitleStyle: {
            fontFamily: 'Baloo2_700Bold',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 24,
            lineHeight: 32,
            color: 'white',
          },
          headerBackImage: BackButton,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen name={Routes.MyStack} component={MyStack} />
      <Stack.Screen name={Routes.OtherStack} component={OtherStack} />

      <Stack.Screen name={Routes.Hunch} component={HunchScreen} />

      <Stack.Screen
        name={Routes.Profile}
        component={ProfileNavigator}
      />

      <Stack.Screen
        name={Routes.Trade}
        component={TradeNavigator}
      />

      <Stack.Screen name={Routes.NotFound} component={NotFoundScreen} options={{ title: 'Oops!' }} />

      <Stack.Screen
        name={Routes.NewAccountFlow}
        component={NewAccountNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={Routes.Documents}
        component={Documents}
        options={{
          title: '',
          header: () => <ScreenHeader />,
          headerShown: true,
        }}
      />

      <Stack.Screen
        name={Routes.CreateHunchFlow}
        component={HunchCreationNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={Routes.CreateStackFlow}
        component={StackCreationNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

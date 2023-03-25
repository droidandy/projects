import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ExploreNavigator } from './ExploreNavigator';
import { FundingScreens, Routes } from './routes';
import {
  BottomTabParamList,
  WatchlistScreenParamList,
  HomeParamList,
  FeedParamList,
  BottomTabNavProps,
} from './types';

import { initialState as fundInitialState } from '~/app/home/fund/context';
import { Home, Feed } from '~/app/home/screens';
import WatchlistScreen from '~/app/home/watchlist/WatchlistScreen';
import { Profile } from '~/app/profile/screens';
import { StepContainer } from '~/components/StepContainer';
import { StepContainerContext, StepContainerParamList } from '~/components/StepContainer/types';
import { NavIcon } from '~/components/atoms/navIcon';
import { Modals } from '~/constants/modalScreens';
import useColorScheme from '~/hooks/useColorScheme';
import { colorTheme } from '~/theme/colors';

type Props = {
  navigation: BottomTabNavProps;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator = ({ navigation }: Props): JSX.Element => {
  const colorScheme = useColorScheme();

  const showModal = () => {
    navigation.navigate(Routes.ModalScreen, { activeModal: Modals.CreateStackOrHunch });
  };

  return (
    <BottomTab.Navigator
      initialRouteName={Routes.Home}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorTheme[colorScheme].tint,
        tabBarInactiveTintColor: colorTheme[colorScheme].tabIconDefault,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
      }}
    >
      <BottomTab.Screen
        name={Routes.Home}
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => <NavIcon focused={focused} name="home" />,
        }}
      />
      <BottomTab.Screen
        name={Routes.Feed}
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ focused }) => <NavIcon focused={focused} name="feed" />,
        }}
      />
      <BottomTab.Screen
        name={Routes.ModalScreen}
        component={View}
        options={{
          tabBarIcon: ({ focused }) => <NavIcon focused={focused} name="add" />,
          tabBarButton: (props) => (<TouchableOpacity {...props} onPress={showModal} />),
        }}
      />
      <BottomTab.Screen
        name={Routes.Explore}
        component={ExploreNavigator}
        options={{
          tabBarIcon: ({ focused }) => <NavIcon focused={focused} name="explore" />,
        }}
      />
      <BottomTab.Screen
        name={Routes.Profile}
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => <NavIcon focused={focused} name="avatar" />,
        }}
      />
    </BottomTab.Navigator>
  );
};

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name={Routes.HomeScreen} component={Home} />
    </HomeStack.Navigator>
  );
}

const FeedStack = createStackNavigator<FeedParamList>();

function FeedNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerShown: false }}>
      <FeedStack.Screen name={Routes.FeedScreen} component={Feed} />
    </FeedStack.Navigator>
  );
}

const WatchlistScreenStack = createStackNavigator<WatchlistScreenParamList>();

function WatchlistScreenNavigator() {
  return (
    <WatchlistScreenStack.Navigator>
      <WatchlistScreenStack.Screen
        name="WatchlistScreen"
        component={WatchlistScreen}
        options={{ headerTitle: 'Watchlist' }}
      />
    </WatchlistScreenStack.Navigator>
  );
}

const FundStack = createStackNavigator<StepContainerParamList>();

function FundNavigator() {
  const scContext = useContext(StepContainerContext);
  const { scState, setSCState } = scContext;

  useEffect(() => setSCState(fundInitialState), []);

  return (
    <FundStack.Navigator>
      <FundStack.Screen
        name="StepContainer"
        component={StepContainer}
        initialParams={{ nextScreen: { name: FundingScreens.FundingStack } }}
        options={({ route: { params } }) => {
          const title = params?.nextScreen.navTitle || 'Transfer';
          return { title };
        }}
      />
    </FundStack.Navigator>
  );
}

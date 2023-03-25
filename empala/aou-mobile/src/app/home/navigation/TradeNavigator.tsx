import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC } from 'react';

import { Routes } from './routes';
import { TradeParamList } from './types';

import { AccountHighlights } from '~/app/home/screens/accountHighlights';
import { HeaderButtons } from '~/app/home/screens/accountHighlights/header/HeaderButtons';
import { ActivityDetails } from '~/app/home/screens/trade/activityDetails/ActivityDetails';
import { BuyOrSellScreen, BackButton as BuySellScreenBackButton } from '~/app/home/screens/trade/buyOrSellScreen';
import { ConfirmScreen } from '~/app/home/screens/trade/confirmScreen';
import { OrderDetails } from '~/app/home/screens/trade/orderDetails';
import { ButtonWithIcon } from '~/components/atoms/buttonWithIcon';

const TradeStack = createNativeStackNavigator<TradeParamList>();

type TradeNavigatorProps = NativeStackNavigationProp<TradeParamList, Routes.TradeNavigator>;

type Props = {
  navigation: TradeNavigatorProps;
};

export const TradeNavigator: FC<Props> = (): JSX.Element => (
  <TradeStack.Navigator
    screenOptions={{
      headerShown: true,
      headerBackVisible: true,
      headerLargeTitle: true,
      headerStyle: { backgroundColor: 'white' },
      headerShadowVisible: false,
      contentStyle: { backgroundColor: 'white' },
    }}
  >
    <TradeStack.Screen
      name={Routes.BuyOrSell}
      component={BuyOrSellScreen}
      options={({ route, navigation }) => ({
        title: '',
        headerLargeTitle: false,
        headerLeft: () => BuySellScreenBackButton({ route, navigation }),
      })}
    />

    <TradeStack.Screen
      name={Routes.OrderDetails}
      component={OrderDetails}
      options={({ route, navigation }) => ({
        title: 'Order details',
        headerLargeTitleStyle: {
          fontFamily: 'Inter_800ExtraBold',
          fontSize: 18,
        },
        headerLeft: ({ canGoBack }) => (
          <ButtonWithIcon
            icon="backArrow"
            color="black"
            onPress={() => {
              if (canGoBack) (navigation as TradeNavigatorProps).goBack();
            }}
          />
        ),
        headerBackVisible: false,
      })}
    />

    <TradeStack.Screen
      name={Routes.ActivityDetails}
      component={ActivityDetails}
      options={({ route, navigation }) => ({
        title: 'Activity details',
        headerLargeTitleStyle: {
          fontFamily: 'Inter_800ExtraBold',
          fontSize: 18,
        },
        headerLeft: ({ canGoBack }) => (
          <ButtonWithIcon
            icon="backArrow"
            color="black"
            onPress={() => {
              if (canGoBack) (navigation as TradeNavigatorProps).goBack();
            }}
          />
        ),
        headerBackVisible: false,
      })}
    />

    <TradeStack.Screen
      name={Routes.ConfirmTrade}
      component={ConfirmScreen}
      options={({ route }) => ({
        title: '',
        headerBackTitle: 'Cancel',
      })}
    />

    <TradeStack.Screen
      name={Routes.AccountHighlights}
      component={AccountHighlights}
      options={({ route, navigation }) => ({
        title: 'Account Highlights',
        headerStyle: { backgroundColor: 'white' },
        headerLargeTitleStyle: {
          fontFamily: 'Inter_800ExtraBold',
          fontSize: 24,
        },
        headerLeft: ({ canGoBack }) => (
          <ButtonWithIcon
            icon="backArrow"
            color="black"
            onPress={() => {
              (navigation as TradeNavigatorProps).popToTop();
            }}
          />
        ),
        headerRight: () => (
          <HeaderButtons />
        ),
      })}
    />
  </TradeStack.Navigator>
);

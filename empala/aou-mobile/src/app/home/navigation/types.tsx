import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

import { OnboardingScreens, Routes } from './routes';

import { Activity } from '~/app/home/screens/accountHighlights/tabContent/accountActivity/types';
import { Tab } from '~/app/home/screens/accountHighlights/types';
import {
  Order, OrderOptionsData, OrderType, TimeInForce, TradeType,
} from '~/app/home/types/trade';
import { ModalRootProps } from '~/components/modalScreen/ModalScreen';
import { Modals, ModalParams } from '~/constants/modalScreens';

export type CommonRoutesParamList = {
  [Routes.Home]: undefined,
};

export type RootStackParamList = {
  [Routes.Root]: undefined;
  [Routes.NotFound]: undefined;
  [Routes.AccountHighlights]: { initialTab: Tab };
  [Routes.NewAccountFlow]: { initialRoute: string };
  [Routes.CreateHunchFlow]: undefined;
  [Routes.CreateStackFlow]: undefined;
  [Routes.ExploreStacks]: undefined;
  [Routes.Stacks]: undefined;
  [Routes.MyStack]: undefined;
  [Routes.OtherStack]: undefined;
  [Routes.Hunch]: undefined;
  [Routes.ExploreHunches]: undefined;
  [Routes.Hunches]: undefined;
  [Routes.Investopeers]: undefined;
  [Routes.Trade]: undefined;
  [Routes.CompaniesList]: undefined;
  [Routes.Profile]: undefined;
  [Routes.CreateModal]: undefined;
  [Routes.ActionSheet]: undefined;
  [Routes.ModalScreen]: {
    activeModal: Modals,
    backScreen: Routes,
    defaultValues: ModalParams,
    gateName?: string;
  };
};

export type ModalStackParamList = {
  [Routes.Main]: undefined;
  [Routes.AccountSelector]: undefined;
  [Routes.ModalScreen]: undefined;
  [Routes.CreateHunchFlow]: undefined;
  [Routes.CreateStackFlow]: undefined;
  [Routes.FullScreen]: undefined;
};

export type NewAccountFlowStackParamList = {
  [Routes.NewAccountScreen]: undefined;
  [Routes.ConfirmAccountDetails]: undefined;
};

export type BottomTabParamList = {
  [Routes.Watchlist]: undefined;
  [Routes.Trade]: undefined;
  [Routes.Home]: undefined;
  [Routes.Feed]: undefined;
  [Routes.Fund]: undefined;
  [Routes.Profile]: undefined;
  [Routes.ExploreScreen]: undefined;
  [Routes.ModalScreen]: ModalRootProps | undefined;
};

export type BottomTabNavProps = BottomTabNavigationProp<BottomTabParamList>;

export type HomeParamList = {
  Positions: undefined;
  [Routes.HomeScreen]: undefined;
  [Routes.Main]: { screen: Routes }
  [Routes.CreateStackFlow]: undefined;
};
export type HomeNavProps = StackNavigationProp<HomeParamList>;

export type FeedParamList = {
  [Routes.FeedScreen]: undefined;
};
export type FeedNavProps = StackNavigationProp<FeedParamList>;

export type ExploreParamList = {
  [Routes.ExploreScreen]: undefined;
  [Routes.CompanyProfile]: { companyId: number };
};
export type ExploreNavProps = StackNavigationProp<ExploreParamList>;

export type TradeParamList = {
  [Routes.TradeNavigator]: undefined;
  [Routes.OrderDetails]: { order: Order };
  [Routes.ActivityDetails]: { activity: Activity };
  [Routes.Trade]: {
    screen: Routes.BuyOrSell,
    params: { data: OrderOptionsData },
  };
  [Routes.BuyOrSell]: {
    data: OrderOptionsData
  };
  [Routes.ConfirmTrade]: {
    data: {
      tradeType: TradeType;
      companyName: string;
      amount: number;
      shareCount: number;
      sharePrice: number;
      orderType: OrderType;
      timeInForce: TimeInForce;
      extendedHours: boolean;
      accountId: number;
    },
  };
  [Routes.AccountHighlights]: { initialTab: Tab };
};
export type TradeNavProps = StackNavigationProp<TradeParamList>;

export type WatchlistScreenParamList = {
  WatchlistScreen: undefined;
};

export type TradeScreenParamList = {
  Trade: undefined;
};

export type ProfileParamList = {
  [Routes.ProfileScreen]: undefined;
  [Routes.EditProfileScreen]: undefined;
  [Routes.Feedback]: undefined;
  [Routes.Documents]: undefined;
};

export type ProfileNavProps = StackNavigationProp<ProfileParamList>;

export type OnboardingParamList = {
  [Routes.StepContainer]: undefined,
  [Routes.ModalScreen]: undefined,
  [Routes.OnboardingError]: {
    screen: OnboardingScreens
  },
};

export type OnboardingNavProps = StackNavigationProp<OnboardingParamList>;

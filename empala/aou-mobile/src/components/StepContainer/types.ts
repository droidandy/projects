import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import {
  Routes, CreateHunchScreens, CreateStackScreens, FundingScreens, OnboardingScreens,
} from '~/app/home/navigation/routes';

export type SCscreens = FundingScreens | OnboardingScreens | CreateStackScreens | CreateHunchScreens;

export type StepContainerConfiguration = {
  container: (args: any) => JSX.Element;
  config: Partial<Record<SCscreens, ScreenConfig>>;
  backgroundJobs?: Record<string, (args: any) => Promise<any>>;
  jobResults?: {
    responses?: Record<string, any>,
    errors?: Record<string, string | null>,
    isLoading?: Record<string, boolean>,
  };
};

export const StepContainerContext = React.createContext({} as SCContext);
export type SCContext = {
  scState: StepContainerConfiguration;
  setSCState: React.Dispatch<React.SetStateAction<StepContainerConfiguration>>;
};

export type StepContainerParamList = {
  StepContainer: {
    nextScreen: NextScreenData;
    title?: string;
  };
};

export type NextScreenData = {
  name: SCscreens;
  navTitle?: string;
  params?: Record<string, unknown>;
};

export type StepContainerNavProps = StackNavigationProp<StepContainerParamList>;
export type StepContainerRouteProp = RouteProp<StepContainerParamList, Routes.StepContainer>;

export type Props = {
  navigation: StepContainerNavProps;
  route: StepContainerRouteProp;
};

export enum ActionTypes {
  NEXT_SCREEN,
  NAVIGATE_NEXT_SCREEN,
  NAVIGATE,
  PUT,
}

export type Action = {
  type: ActionTypes;
  args?: Record<string, unknown>;
};

export type ScreenConfig = {
  title: string;
  meta?: Record<string, unknown>;
  fields: Array<ScreenField>;
};

export type NextScreenFunctionType = <T extends StepContainerConfiguration>(state: T) => NextScreenData;

export type ScreenField = {
  component: (args: any) => JSX.Element;
  props?: Record<string, unknown>;
  nextScreen?: NextScreenFunctionType;
};

export type CallbackType = (action: Action) => void;

export type Meta = {
  totalScreens: number;
  screenIndex: number;
}

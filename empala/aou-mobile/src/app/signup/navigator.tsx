import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { Animated } from 'react-native';

import { ErrorScreen } from './containers/errorScreen/ErrorScreen';
import { initialState } from './context';
import { SignUpContext } from './loaderContext';

import { Routes, OnboardingScreens } from '~/app/home/navigation/routes';
import { CompanySearcher } from '~/app/signup/containers/companySearcher/CompanySearcher';
import { StepContainer } from '~/components/StepContainer';
import { StepContainerContext } from '~/components/StepContainer/types';
import { OnboardingLoader } from '~/components/atoms/loader';
import { Layer } from '~/components/containers/Layer';

const RootStack = createStackNavigator();

const RootStackScreen = () => (
  <RootStack.Navigator
    screenOptions={{
      presentation: 'modal',
      gestureEnabled: false,
      animationEnabled: false,
      headerShown: false,
    }}
  >
    <RootStack.Screen
      name={Routes.StepContainer}
      component={StepContainer}
      initialParams={{ nextScreen: { name: OnboardingScreens.OnboardingInterests } }}
    />
    <RootStack.Screen
      name={Routes.ModalScreen}
      component={CompanySearcher}
    />
    <RootStack.Screen
      name={Routes.OnboardingError}
      component={ErrorScreen}
    />
  </RootStack.Navigator>
);

const initialSignUpContext = {
  loaderOpacity: new Animated.Value(1),
};

export const SignUpNavigator = (): JSX.Element => {
  const scContext = useContext(StepContainerContext);
  const { scState, setSCState } = scContext;

  useEffect(() => setSCState(initialState), []);

  return (
    <Layer>
      <SignUpContext.Provider value={initialSignUpContext}>
        <SignUpContext.Consumer>
          {({ loaderOpacity }) => loaderOpacity.__getValue() > 0 && <OnboardingLoader opacity={loaderOpacity} />}
        </SignUpContext.Consumer>

        <RootStackScreen />
      </SignUpContext.Provider>
    </Layer>
  );
};

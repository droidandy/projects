import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import { RootNavigatorWithModal } from './HomeRootNavigator';
import LinkingConfiguration from './LinkingConfiguration';

import { LoadingScreen } from '~/app/LoadingScreen';
import { navigationRef } from '~/app/home/navigation/RootNavigation';
import { Route } from '~/app/home/navigation/routes';
import { SignInNavigator } from '~/app/signin';
import { SignUpNavigator } from '~/app/signup';
import { WelcomeNavigator } from '~/app/welcome';
import { useAppSelector } from '~/store/hooks';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }): JSX.Element {
  const { route } = useAppSelector((state) => state.auth);

  const theme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...DefaultTheme.colors, background: 'transparent',
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={theme}
    >
      {(() => {
        switch (route) {
          case Route.App:
            return <RootNavigatorWithModal />;
          case Route.Signin:
            return <SignInNavigator />;
          case Route.Signup:
            return <SignUpNavigator />;
          case Route.Welcome:
            return <WelcomeNavigator />;
          default:
            return <LoadingScreen />;
        }
      })()}
    </NavigationContainer>
  );
}

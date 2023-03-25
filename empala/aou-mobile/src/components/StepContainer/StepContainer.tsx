import React, { FC, useCallback, useContext } from 'react';
import { View } from 'react-native';

import {
  Action,
  ActionTypes,
  CallbackType,
  NextScreenFunctionType,
  Props,
  ScreenConfig,
  StepContainerContext,
} from './types';

import { Routes } from '~/app/home/navigation/routes';

export const StepContainer: FC<Props> = ({ navigation, route }: Props) => {
  const { scState, setSCState } = useContext(StepContainerContext);
  const { container: Container, config: screens = {} } = scState;

  const path = route.params?.nextScreen?.name;
  const pathProps = route.params?.nextScreen?.params;

  const currentScreen = screens[path];

  const reducer = useCallback(
    (calculateNextScreen: NextScreenFunctionType | undefined): CallbackType => (action: Action) => {
      const { type, args } = action;

      switch (type) {
        case ActionTypes.NEXT_SCREEN: {
          let newState;
          setSCState((prev) => {
            newState = { ...prev, ...action.args };
            return newState;
          });
          if (calculateNextScreen && newState) {
            const nextScreen = calculateNextScreen(newState);
            navigation.push(Routes.StepContainer, { nextScreen });
          }
          break;
        }
        case ActionTypes.NAVIGATE_NEXT_SCREEN: {
          let newState;
          setSCState((prev) => {
            newState = { ...prev, ...action.args };
            return newState;
          });
          if (calculateNextScreen && newState) {
            const nextScreen = calculateNextScreen(newState);
            navigation.navigate(nextScreen, { nextScreen });
          }
          break;
        }
        case ActionTypes.NAVIGATE: {
          navigation.navigate(args?.route, args?.params);
          break;
        }
        case ActionTypes.PUT: {
          setSCState((prev) => ({ ...prev, ...action.args }));
          break;
        }
        // no default
      }
    }, [navigation],
  );

  const createScreen = (screenConfig: ScreenConfig): JSX.Element => (
    <Container>
      {screenConfig.fields.map(({
        component: Component,
        props: screenConfigProps,
        nextScreen,
      }, index) => {
        const callback = reducer(nextScreen);
        const fullProps = {
          ...scState,
          ...pathProps,
          ...screenConfigProps,
          callback,
        };
        // eslint-disable-next-line react/jsx-props-no-spreading
        return (
          <Component
            key={index}
            {...fullProps}
          />
        );
      })}
    </Container>
  );

  return (
    <View style={{ flex: 1 }}>
      {currentScreen && createScreen(currentScreen)}
    </View>
  );
};

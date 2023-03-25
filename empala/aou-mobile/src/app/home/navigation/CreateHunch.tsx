import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';

import { initialState as createHunchInitialState } from '~/app/home/hunch/context';
import { screens } from '~/app/home/hunch/screensConfig';
import { StepContainer } from '~/components/StepContainer';
import { StepContainerContext, StepContainerParamList } from '~/components/StepContainer/types';
import { BackButton } from '~/components/atoms/backIcon/BackIcon';
import { Layer } from '~/components/containers/Layer';

const HunchCreationStack = createStackNavigator<StepContainerParamList>();

export const HunchCreationNavigator = ({ navigation }): JSX.Element => {
  const scContext = useContext(StepContainerContext);
  const { scState, setSCState } = scContext;

  useEffect(() => setSCState(createHunchInitialState), []);

  const createScreens = screens.map((screen) => (
    <HunchCreationStack.Screen
      key={screen.key}
      name={screen.key}
      component={StepContainer}
      initialParams={{ nextScreen: { name: screen.key } }}
      options={{
        headerShown: screen.field?.headerShown,
        headerTransparent: true,
        title: screen.field?.headerShown ? screen.field.title : '',
        headerTitleStyle: {
          fontFamily: 'Baloo2_700Bold',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: 24,
          lineHeight: 32,
          color: 'white',
        },
        headerStyle: {
          backgroundColor: 'transparent',
          shadowOpacity: 0,
        },
        headerBackImage: BackButton,
        headerBackTitleVisible: false,
      }}
    />
  ));

  return (
    <Layer>
      <HunchCreationStack.Navigator>
        {createScreens}
      </HunchCreationStack.Navigator>
    </Layer>
  );
};

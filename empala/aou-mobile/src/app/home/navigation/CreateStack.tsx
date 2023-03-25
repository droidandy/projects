import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useContext } from 'react';

import { initialState as createStackInitialState } from '~/app/home/stack/context';
import { screens } from '~/app/home/stack/screensConfig';
import { StepContainer } from '~/components/StepContainer';
import { StepContainerContext, StepContainerParamList } from '~/components/StepContainer/types';
import { BackButton } from '~/components/atoms/backIcon/BackIcon';
import { Layer } from '~/components/containers/Layer';

const StackCreationStack = createStackNavigator<StepContainerParamList>();

export const StackCreationNavigator = ({ navigation }): JSX.Element => {
  const scContext = useContext(StepContainerContext);
  const { scState, setSCState } = scContext;

  useEffect(() => setSCState(createStackInitialState), []);

  const createScreens = screens.map((screen) => (
    <StackCreationStack.Screen
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
      <StackCreationStack.Navigator>
        {createScreens}
      </StackCreationStack.Navigator>
    </Layer>
  );
};

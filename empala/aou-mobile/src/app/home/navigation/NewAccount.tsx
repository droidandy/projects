import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';

import { Routes } from './routes';

import { ConfirmAccountDetails } from '~/app/home/fund/screens/ConfirmAccountDetails';
import { NewAccountFlowStackParamList, RootStackParamList } from '~/app/home/navigation/types';
import { Accounts } from '~/app/home/screens/accounts';

const Stack = createNativeStackNavigator<NewAccountFlowStackParamList>();

type Props = StackScreenProps<RootStackParamList, Routes.NewAccountFlow>;

export const NewAccountNavigator = ({ route }: Props): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name={Routes.NewAccountScreen}
      component={Accounts}
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name={Routes.ConfirmAccountDetails}
      component={ConfirmAccountDetails}
      options={{ headerTitle: 'Add new account' }}
    />
  </Stack.Navigator>
);

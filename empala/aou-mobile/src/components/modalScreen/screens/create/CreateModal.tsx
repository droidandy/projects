import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import * as s from './createModalStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.CreateModal>;
type Props = {
  navigation: NavigationProps,
};

export const CreateModal = ({ navigation }: Props): JSX.Element => {
  const createStack = () => {
    navigation.navigate(Routes.CreateStackFlow);
  };

  const createHunch = () => {
    navigation.navigate(Routes.CreateHunchFlow);
  };

  return (
    <s.ButtonsContainer>
      <Button title="CREATE INVESTACK™" face="green" onPress={createStack} />

      <Button title="CREATE HUNCH™" face="green" onPress={createHunch} />
    </s.ButtonsContainer>
  );
};

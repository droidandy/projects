import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

import * as s from './actionSheetStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { Button } from '~/components/atoms/button';

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.CreateModal>;
type Props = {
  navigation: NavigationProps,
  backScreen: Routes,
  defaultValue?: { title: string; value: string; }[],
};

export const ActionSheet = ({ navigation, backScreen, defaultValue }: Props): JSX.Element => {
  const onSelect = (selectedValue: string) => {
    navigation.navigate(backScreen, { selectedValue });
  };

  const rederOptions = () => defaultValue?.map((item) => (
    <s.ButtonContainer key={item.value}>
      <Button title={item.title} face="green" onPress={() => onSelect('buy')} />
    </s.ButtonContainer>
  ));

  return (
    <s.Container>
      {rederOptions()}
    </s.Container>
  );
};
